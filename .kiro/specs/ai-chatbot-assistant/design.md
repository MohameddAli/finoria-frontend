# Design Document

## Overview

The AI Chatbot Assistant is a global feature that provides users with instant AI-powered help throughout the banking application. The system consists of a floating action button (FAB) that remains visible on all pages, a chat interface component, a Pinia store for state management, and a Nuxt server API route for secure Gemini API integration.

### Key Design Principles

1. **Global Accessibility**: The chatbot must be accessible from any page without disrupting the user's workflow
2. **Security First**: API keys must never be exposed to the client; all AI requests go through a secure server route
3. **Bilingual Support**: Full support for Arabic (RTL) and English (LTR) with dynamic UI adjustments
4. **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
5. **Vuetify Integration**: Consistent with the existing Vuetify 3 design system and theme

## Architecture

### Component Hierarchy

```
app.vue (Root)
├── NuxtLayout
│   ├── default.vue (Layout)
│   │   ├── AppHeader
│   │   ├── AppSidebar
│   │   ├── NuxtPage (Content)
│   │   └── AIChatbotFAB (New - Global)
│   │       └── AIChatbotDialog (New - Conditional)
```

### Data Flow

```mermaid
graph TD
    A[User Input] --> B[AIChatbotDialog Component]
    B --> C[useChatStore]
    C --> D[/api/chat/gemini Server Route]
    D --> E[Gemini API]
    E --> F[AI Response]
    F --> D
    D --> C
    C --> B
    B --> G[Display Response]
```

### State Management Flow

```
User Action → Component Event → Store Action → API Call → Store Mutation → Component Update
```

## Components and Interfaces

### 1. AIChatbotFAB Component

**Location**: `app/components/chatbot/AIChatbotFAB.vue`

**Purpose**: Floating action button that toggles the chatbot dialog

**Props**: None (uses global store)

**Features**:
- Fixed positioning (bottom-right for LTR, bottom-left for RTL)
- Smooth scale animation on hover
- Badge indicator for unread AI responses (optional future enhancement)
- Z-index: 1000 to stay above all content
- Responsive positioning adjustments for mobile

**Template Structure**:
```vue
<template>
  <v-btn
    :class="fabClasses"
    :style="fabStyles"
    color="primary"
    size="large"
    icon
    elevation="6"
    @click="toggleChat"
  >
    <v-icon size="28">mdi-robot-outline</v-icon>
  </v-btn>
</template>
```

**Styling**:
- Position: fixed
- Bottom: 24px (mobile: 16px)
- Right/Left: 24px (mobile: 16px) - depends on locale direction
- Transition: transform 0.2s ease
- Hover: scale(1.1)

### 2. AIChatbotDialog Component

**Location**: `app/components/chatbot/AIChatbotDialog.vue`

**Purpose**: Main chat interface with message history and input

**Props**:
```typescript
interface Props {
  modelValue: boolean; // v-model for open/close state
}
```

**Emits**:
```typescript
interface Emits {
  'update:modelValue': (value: boolean) => void;
}
```

**Features**:
- Full-screen on mobile (< 768px)
- Fixed-width panel on desktop (400px width, 600px height)
- Auto-scroll to latest message
- Loading indicator during API calls
- Error message display
- Message timestamps
- RTL/LTR layout support

**Template Structure**:
```vue
<template>
  <v-dialog
    :model-value="modelValue"
    :fullscreen="isMobile"
    :max-width="isMobile ? undefined : 400"
    :transition="dialogTransition"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card :height="isMobile ? '100%' : 600">
      <!-- Header -->
      <v-card-title class="chatbot-header">
        <v-icon>mdi-robot-outline</v-icon>
        <span>{{ t('chatbot.title') }}</span>
        <v-spacer />
        <v-btn icon size="small" @click="closeChat">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <!-- Messages Container -->
      <v-card-text ref="messagesContainer" class="messages-container">
        <div v-for="message in messages" :key="message.id" :class="messageClasses(message)">
          <div class="message-content">
            <v-icon v-if="message.role === 'assistant'" size="small">mdi-robot</v-icon>
            <div class="message-text">{{ message.content }}</div>
          </div>
          <div class="message-time">{{ formatTime(message.timestamp) }}</div>
        </div>

        <!-- Loading Indicator -->
        <div v-if="isLoading" class="loading-message">
          <v-progress-circular indeterminate size="20" width="2" />
          <span>{{ t('chatbot.thinking') }}</span>
        </div>

        <!-- Error Message -->
        <v-alert v-if="error" type="error" density="compact" closable @click:close="clearError">
          {{ error }}
        </v-alert>
      </v-card-text>

      <!-- Input Area -->
      <v-card-actions class="input-area">
        <v-textarea
          v-model="userInput"
          :placeholder="t('chatbot.inputPlaceholder')"
          :disabled="isLoading"
          rows="2"
          auto-grow
          variant="outlined"
          density="compact"
          hide-details
          @keydown.enter.exact.prevent="sendMessage"
        />
        <v-btn
          :disabled="!userInput.trim() || isLoading"
          :loading="isLoading"
          color="primary"
          icon
          @click="sendMessage"
        >
          <v-icon>mdi-send</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
```

### 3. Chat Store (Pinia)

**Location**: `app/stores/chat.ts`

**Purpose**: Centralized state management for chat functionality

**State**:
```typescript
interface ChatState {
  messages: Message[];
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  sessionId: string | null;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
```

**Getters**:
```typescript
const getters = {
  messageCount: (state) => state.messages.length,
  lastMessage: (state) => state.messages[state.messages.length - 1],
  hasError: (state) => state.error !== null,
};
```

**Actions**:
```typescript
const actions = {
  // Toggle chat dialog open/close
  toggleChat(): void;
  
  // Open chat dialog
  openChat(): void;
  
  // Close chat dialog
  closeChat(): void;
  
  // Send message to AI
  async sendMessage(content: string): Promise<void>;
  
  // Clear error state
  clearError(): void;
  
  // Clear all messages
  clearMessages(): void;
  
  // Initialize session (generate session ID)
  initializeSession(): void;
};
```

**Implementation Details**:
```typescript
export const useChatStore = defineStore('chat', () => {
  const messages = ref<Message[]>([]);
  const isOpen = ref(false);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const sessionId = ref<string | null>(null);
  const { locale } = useI18n();

  const toggleChat = () => {
    isOpen.value = !isOpen.value;
  };

  const openChat = () => {
    isOpen.value = true;
  };

  const closeChat = () => {
    isOpen.value = false;
  };

  const clearError = () => {
    error.value = null;
  };

  const clearMessages = () => {
    messages.value = [];
  };

  const initializeSession = () => {
    if (!sessionId.value) {
      sessionId.value = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Initialize session if needed
    initializeSession();

    // Add user message
    const userMessage: Message = {
      id: `msg_${Date.now()}_user`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };
    messages.value.push(userMessage);

    // Set loading state
    isLoading.value = true;
    error.value = null;

    try {
      // Call server API
      const response = await $fetch('/api/chat/gemini', {
        method: 'POST',
        body: {
          message: content.trim(),
          sessionId: sessionId.value,
          locale: locale.value,
          conversationHistory: messages.value.slice(-10), // Last 10 messages for context
        },
      });

      // Add AI response
      const aiMessage: Message = {
        id: `msg_${Date.now()}_ai`,
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
      };
      messages.value.push(aiMessage);
    } catch (err: any) {
      error.value = err.message || 'Failed to get response from AI assistant';
      console.error('Chat error:', err);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    messages,
    isOpen,
    isLoading,
    error,
    sessionId,
    toggleChat,
    openChat,
    closeChat,
    sendMessage,
    clearError,
    clearMessages,
    initializeSession,
  };
});
```

### 4. Server API Route

**Location**: `server/api/chat/gemini.post.ts`

**Purpose**: Secure proxy for Gemini API requests

**Request Body**:
```typescript
interface ChatRequest {
  message: string;
  sessionId: string;
  locale: string;
  conversationHistory: Message[];
}
```

**Response**:
```typescript
interface ChatResponse {
  message: string;
  timestamp: string;
}
```

**Implementation**:
```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

export default defineEventHandler(async (event) => {
  try {
    // Get request body
    const body = await readBody(event);
    const { message, sessionId, locale, conversationHistory } = body;

    // Validate input
    if (!message || typeof message !== 'string') {
      throw createError({
        statusCode: 400,
        message: 'Invalid message',
      });
    }

    // Get API key from environment
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw createError({
        statusCode: 500,
        message: 'Gemini API key not configured',
      });
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Build context prompt
    const systemPrompt = locale === 'ar'
      ? 'أنت مساعد ذكي لتطبيق بنكي. ساعد المستخدمين بالإجابة على أسئلتهم حول الخدمات البنكية والتطبيق. كن مهذباً ومفيداً.'
      : 'You are an AI assistant for a banking application. Help users by answering their questions about banking services and the application. Be polite and helpful.';

    // Build conversation context
    let conversationContext = systemPrompt + '\n\n';
    if (conversationHistory && conversationHistory.length > 0) {
      conversationContext += 'Previous conversation:\n';
      conversationHistory.forEach((msg: Message) => {
        conversationContext += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
      });
    }
    conversationContext += `\nUser: ${message}\nAssistant:`;

    // Generate response
    const result = await model.generateContent(conversationContext);
    const response = await result.response;
    const aiMessage = response.text();

    // Return response
    return {
      message: aiMessage,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('Gemini API error:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to process chat request',
    });
  }
});
```

## Data Models

### Message Model

```typescript
interface Message {
  id: string;              // Unique identifier: msg_timestamp_role
  role: 'user' | 'assistant'; // Message sender
  content: string;         // Message text
  timestamp: Date;         // When message was sent
}
```

### Chat Session Model

```typescript
interface ChatSession {
  sessionId: string;       // Unique session identifier
  messages: Message[];     // All messages in session
  createdAt: Date;        // Session start time
  lastActivity: Date;     // Last message time
}
```

## Error Handling

### Client-Side Error Handling

1. **Network Errors**: Display user-friendly message with retry option
2. **Validation Errors**: Prevent sending empty messages
3. **API Errors**: Show error alert in chat interface
4. **Timeout Errors**: Implement 30-second timeout with retry

### Server-Side Error Handling

1. **Missing API Key**: Return 500 with configuration error
2. **Invalid Request**: Return 400 with validation message
3. **Gemini API Errors**: Catch and return appropriate error codes
4. **Rate Limiting**: Implement request throttling (future enhancement)

### Error Messages (i18n)

```json
{
  "chatbot": {
    "errors": {
      "networkError": "Network error. Please check your connection.",
      "apiError": "Failed to get response. Please try again.",
      "emptyMessage": "Please enter a message.",
      "timeout": "Request timed out. Please try again.",
      "configError": "Chatbot is temporarily unavailable."
    }
  }
}
```

## Testing Strategy

### Unit Tests

1. **Store Tests**:
   - Test message addition
   - Test state mutations
   - Test error handling
   - Test session initialization

2. **Component Tests**:
   - Test FAB click behavior
   - Test dialog open/close
   - Test message rendering
   - Test input validation
   - Test RTL/LTR layout

### Integration Tests

1. **API Route Tests**:
   - Test successful request/response
   - Test error scenarios
   - Test authentication (if added)
   - Test rate limiting (if added)

2. **E2E Tests**:
   - Test complete user flow
   - Test language switching
   - Test mobile responsiveness
   - Test message persistence

### Manual Testing Checklist

- [ ] FAB appears on all pages
- [ ] FAB positioned correctly in LTR and RTL
- [ ] Dialog opens/closes smoothly
- [ ] Messages display correctly
- [ ] Auto-scroll works
- [ ] Loading indicator shows during API call
- [ ] Error messages display properly
- [ ] Input validation works
- [ ] Send button enables/disables correctly
- [ ] Mobile layout is full-screen
- [ ] Desktop layout is fixed-width panel
- [ ] Theme colors apply correctly
- [ ] i18n translations work
- [ ] API responses are correct
- [ ] Session persistence works

## Styling and Theming

### CSS Variables (Vuetify Theme)

```scss
.chatbot-fab {
  position: fixed;
  bottom: 24px;
  z-index: 1000;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }

  // RTL positioning
  [dir="rtl"] & {
    left: 24px;
    right: auto;
  }

  // LTR positioning
  [dir="ltr"] & {
    right: 24px;
    left: auto;
  }

  // Mobile adjustments
  @media (max-width: 600px) {
    bottom: 16px;
    
    [dir="rtl"] & {
      left: 16px;
    }
    
    [dir="ltr"] & {
      right: 16px;
    }
  }
}

.chatbot-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
}

.messages-container {
  height: 100%;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  display: flex;
  flex-direction: column;
  max-width: 80%;
  
  &.user-message {
    align-self: flex-end;
    
    .message-content {
      background: rgb(var(--v-theme-primary));
      color: rgb(var(--v-theme-on-primary));
      border-radius: 16px 16px 4px 16px;
    }
  }
  
  &.assistant-message {
    align-self: flex-start;
    
    .message-content {
      background: rgb(var(--v-theme-surface-variant));
      color: rgb(var(--v-theme-on-surface-variant));
      border-radius: 16px 16px 16px 4px;
      display: flex;
      gap: 8px;
      align-items: flex-start;
    }
  }
}

.message-content {
  padding: 12px 16px;
  word-wrap: break-word;
}

.message-text {
  flex: 1;
}

.message-time {
  font-size: 0.75rem;
  opacity: 0.7;
  margin-top: 4px;
  padding: 0 8px;
}

.input-area {
  padding: 16px;
  gap: 8px;
  border-top: 1px solid rgb(var(--v-theme-surface-variant));
}

.loading-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  opacity: 0.7;
}
```

## Internationalization (i18n)

### Translation Keys

**English (en.json)**:
```json
{
  "chatbot": {
    "title": "AI Assistant",
    "inputPlaceholder": "Type your message...",
    "thinking": "AI is thinking...",
    "send": "Send",
    "close": "Close",
    "clearChat": "Clear Chat",
    "errors": {
      "networkError": "Network error. Please check your connection.",
      "apiError": "Failed to get response. Please try again.",
      "emptyMessage": "Please enter a message.",
      "timeout": "Request timed out. Please try again.",
      "configError": "Chatbot is temporarily unavailable."
    },
    "welcome": "Hello! How can I help you today?",
    "noMessages": "No messages yet. Start a conversation!"
  }
}
```

**Arabic (ar.json)**:
```json
{
  "chatbot": {
    "title": "المساعد الذكي",
    "inputPlaceholder": "اكتب رسالتك...",
    "thinking": "الذكاء الاصطناعي يفكر...",
    "send": "إرسال",
    "close": "إغلاق",
    "clearChat": "مسح المحادثة",
    "errors": {
      "networkError": "خطأ في الشبكة. يرجى التحقق من اتصالك.",
      "apiError": "فشل الحصول على رد. يرجى المحاولة مرة أخرى.",
      "emptyMessage": "يرجى إدخال رسالة.",
      "timeout": "انتهت مهلة الطلب. يرجى المحاولة مرة أخرى.",
      "configError": "المساعد الذكي غير متاح مؤقتاً."
    },
    "welcome": "مرحباً! كيف يمكنني مساعدتك اليوم؟",
    "noMessages": "لا توجد رسائل بعد. ابدأ محادثة!"
  }
}
```

## Performance Considerations

### Optimization Strategies

1. **Lazy Loading**: Load chatbot components only when first opened
2. **Message Pagination**: Limit displayed messages to last 50, load more on scroll
3. **Debouncing**: Debounce typing indicator (future enhancement)
4. **Caching**: Cache session data in localStorage
5. **Code Splitting**: Separate chatbot code into its own chunk

### Performance Metrics

- Initial load time: < 100ms (lazy loaded)
- Message send latency: < 2s (depends on Gemini API)
- UI responsiveness: 60fps animations
- Memory usage: < 10MB for 100 messages

## Security Considerations

### API Key Protection

1. **Never expose API key in client code**
2. **Use server-side proxy for all AI requests**
3. **Validate all inputs on server**
4. **Implement rate limiting** (future enhancement)

### Data Privacy

1. **No persistent storage of messages** (session only)
2. **No PII sent to Gemini API** (user should be warned)
3. **Session IDs are client-generated** (no server tracking)
4. **Clear messages on logout** (future enhancement)

### Input Sanitization

1. **Sanitize user input before sending to API**
2. **Escape HTML in displayed messages**
3. **Limit message length** (max 1000 characters)
4. **Prevent XSS attacks**

## Future Enhancements

### Phase 2 Features

1. **Message Persistence**: Save chat history to database
2. **Typing Indicator**: Show when AI is generating response
3. **Voice Input**: Speech-to-text for messages
4. **File Attachments**: Allow users to upload images for context
5. **Suggested Responses**: Quick reply buttons
6. **Chat History**: View past conversations
7. **Multi-language Detection**: Auto-detect user language
8. **Sentiment Analysis**: Track user satisfaction
9. **Analytics Dashboard**: Track chatbot usage metrics
10. **Custom Training**: Fine-tune AI on banking-specific data

### Phase 3 Features

1. **Video Chat**: Live video support with human agents
2. **Screen Sharing**: Allow agents to see user's screen
3. **Co-browsing**: Guide users through the application
4. **Appointment Booking**: Schedule meetings with bank staff
5. **Transaction Support**: Help with specific transactions
6. **Document Processing**: Extract data from uploaded documents

## Deployment Checklist

- [ ] Add GEMINI_API_KEY to environment variables
- [ ] Install @google/generative-ai package
- [ ] Create all component files
- [ ] Create store file
- [ ] Create server API route
- [ ] Add i18n translations
- [ ] Add chatbot to default layout
- [ ] Test on all pages
- [ ] Test in both languages
- [ ] Test on mobile devices
- [ ] Test error scenarios
- [ ] Update documentation
- [ ] Deploy to staging
- [ ] User acceptance testing
- [ ] Deploy to production
