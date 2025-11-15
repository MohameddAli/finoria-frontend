# Implementation Plan

- [x] 1. Setup and Dependencies





  - Install @google/generative-ai package for Gemini API integration
  - Verify GEMINI_API_KEY is available in .env file
  - _Requirements: 7.1, 7.2, 7.3_

- [x] 2. Create Chat Store (Pinia)





  - [x] 2.1 Create store file at app/stores/chat.ts


    - Define ChatState interface with messages, isOpen, isLoading, error, sessionId
    - Define Message interface with id, role, content, timestamp
    - Implement state refs: messages, isOpen, isLoading, error, sessionId
    - _Requirements: 3.5, 5.1, 5.2_
  
  - [x] 2.2 Implement store actions

    - Implement toggleChat(), openChat(), closeChat() actions
    - Implement sendMessage(content: string) async action with API call to /api/chat/gemini
    - Implement clearError() and clearMessages() actions
    - Implement initializeSession() to generate unique session IDs
    - Add error handling for API failures
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 7.4_

- [x] 3. Create Server API Route











  - [x] 3.1 Create server route at server/api/chat/gemini.post.ts



    - Import GoogleGenerativeAI from @google/generative-ai
    - Read GEMINI_API_KEY from process.env
    - Validate request body (message, sessionId, locale, conversationHistory)
    - Return 400 error for invalid requests
    - Return 500 error if API key is missing
    - _Requirements: 7.1, 7.2, 7.3, 7.4_
  

  - [x] 3.2 Implement Gemini API integration

    - Initialize GoogleGenerativeAI with API key
    - Get gemini-pro model instance
    - Build system prompt based on locale (Arabic or English)
    - Include conversation history in context (last 10 messages)
    - Generate AI response using model.generateContent()
    - Return formatted response with message and timestamp
    - _Requirements: 3.1, 3.2, 3.3, 5.3, 5.4_
  

  - [x] 3.3 Add comprehensive error handling


    - Catch and log Gemini API errors
    - Return appropriate HTTP status codes (400, 500)
    - Handle timeout scenarios
    - Implement request validation
    - _Requirements: 3.4, 7.4_

- [x] 4. Create AIChatbotFAB Component






  - [x] 4.1 Create component file at app/components/chatbot/AIChatbotFAB.vue

    - Use Composition API with <script setup>
    - Import useChatStore and useI18n
    - Get isOpen state from store
    - Implement toggleChat click handler
    - _Requirements: 1.1, 1.5, 2.1, 2.2, 2.3, 6.3_
  
  - [x] 4.2 Implement FAB template and styling


    - Use v-btn with icon, color="primary", size="large", elevation="6"
    - Add mdi-robot-outline icon
    - Apply fixed positioning with computed classes for RTL/LTR
    - Set z-index to 1000
    - Position bottom-right for LTR, bottom-left for RTL
    - Add hover scale animation (transform: scale(1.1))
    - Make responsive for mobile (adjust spacing)
    - _Requirements: 1.5, 2.1, 2.2, 2.3, 2.4, 2.5, 8.3_

- [x] 5. Create AIChatbotDialog Component





  - [x] 5.1 Create component file at app/components/chatbot/AIChatbotDialog.vue


    - Use Composition API with <script setup>
    - Define props: modelValue (boolean)
    - Define emits: update:modelValue
    - Import useChatStore, useI18n, useDisplay (Vuetify)
    - Get messages, isLoading, error from store
    - Create userInput ref for text input
    - Create messagesContainer ref for auto-scroll
    - _Requirements: 1.2, 1.3, 4.1, 4.2, 5.1, 5.2_
  

  - [x] 5.2 Implement dialog template structure

    - Use v-dialog with fullscreen on mobile, max-width 400px on desktop
    - Add v-card with height 600px (100% on mobile)
    - Create header with title, icon, and close button
    - Create scrollable messages container
    - Add loading indicator with v-progress-circular
    - Add error alert with v-alert (closable)
    - Create input area with v-textarea and send button
    - _Requirements: 1.2, 1.3, 3.2, 4.1, 4.2, 4.3, 6.1, 6.2, 8.1, 8.2_
  
  - [x] 5.3 Implement message rendering

    - Loop through messages with v-for
    - Apply different classes for user vs assistant messages
    - User messages: align right, primary color, rounded corners
    - Assistant messages: align left, surface-variant color, include robot icon
    - Display message content and timestamp
    - Format timestamp with Intl.DateTimeFormat
    - _Requirements: 4.1, 4.2, 5.4_
  


  - [x] 5.4 Implement message input and send functionality

    - Bind v-textarea to userInput ref
    - Disable input when isLoading is true
    - Disable send button when input is empty or loading
    - Call store.sendMessage() on button click
    - Call store.sendMessage() on Enter key (prevent default)
    - Clear input after sending
    - _Requirements: 3.1, 4.3, 4.4, 6.1_


  

  - [ ] 5.5 Implement auto-scroll to latest message
    - Watch messages array for changes
    - Scroll messagesContainer to bottom when new message added
    - Use nextTick to ensure DOM is updated before scrolling
    - Smooth scroll behavior
    - _Requirements: 4.5_



  
  - [ ] 5.6 Add RTL/LTR layout support
    - Use computed property for dialog transition based on locale
    - Apply RTL-specific styles when locale is 'ar'
    - Adjust message alignment for RTL
    - Ensure icons and buttons are positioned correctly

    - _Requirements: 5.1, 5.2, 8.2_

  

  - [ ] 5.7 Implement responsive design
    - Use Vuetify's useDisplay composable to detect mobile
    - Apply fullscreen dialog on mobile (< 768px)
    - Apply fixed-width panel on desktop (400px width, 600px height)
    - Adjust input area height for mobile keyboard
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 6. Add i18n Translations





  - [x] 6.1 Add English translations to i18n/locales/en.json


    - Add chatbot.title: "AI Assistant"
    - Add chatbot.inputPlaceholder: "Type your message..."
    - Add chatbot.thinking: "AI is thinking..."
    - Add chatbot.send: "Send"
    - Add chatbot.close: "Close"
    - Add chatbot.clearChat: "Clear Chat"
    - Add chatbot.welcome: "Hello! How can I help you today?"
    - Add chatbot.noMessages: "No messages yet. Start a conversation!"
    - _Requirements: 5.1, 5.2_
  

  - [x] 6.2 Add Arabic translations to i18n/locales/ar.json

    - Add chatbot.title: "المساعد الذكي"
    - Add chatbot.inputPlaceholder: "اكتب رسالتك..."
    - Add chatbot.thinking: "الذكاء الاصطناعي يفكر..."
    - Add chatbot.send: "إرسال"
    - Add chatbot.close: "إغلاق"
    - Add chatbot.clearChat: "مسح المحادثة"
    - Add chatbot.welcome: "مرحباً! كيف يمكنني مساعدتك اليوم؟"
    - Add chatbot.noMessages: "لا توجد رسائل بعد. ابدأ محادثة!"
    - _Requirements: 5.1, 5.2_
  

  - [ ] 6.3 Add error message translations
    - Add chatbot.errors.networkError in both languages
    - Add chatbot.errors.apiError in both languages
    - Add chatbot.errors.emptyMessage in both languages
    - Add chatbot.errors.timeout in both languages
    - Add chatbot.errors.configError in both languages
    - _Requirements: 3.4, 5.1, 5.2_

- [x] 7. Integrate Chatbot into Application





  - [x] 7.1 Add AIChatbotFAB to default layout


    - Open app/layouts/default.vue
    - Import AIChatbotFAB component
    - Add <AIChatbotFAB /> after main content area
    - Ensure it's outside scrollable content
    - _Requirements: 1.1, 1.4, 2.1_
  

  - [x] 7.2 Add AIChatbotDialog to default layout

    - Import AIChatbotDialog component in default.vue
    - Bind v-model to chatStore.isOpen
    - Add <AIChatbotDialog v-model="chatStore.isOpen" />
    - _Requirements: 1.2, 1.4, 6.4_
- [x] 8. Add Component Styling




- [ ] 8. Add Component Styling

  - [x] 8.1 Create chatbot styles file at app/assets/css/chatbot.css


    - Define .chatbot-fab styles with fixed positioning
    - Define .chatbot-header styles with primary theme colors
    - Define .messages-container styles with scroll and flex layout
    - Define .message, .user-message, .assistant-message styles
    - Define .message-content styles with padding and border-radius
    - Define .message-time styles with small font and opacity
    - Define .input-area styles with border and padding
    - Define .loading-message styles with flex and gap
    - Add RTL-specific styles with [dir="rtl"] selector
    - Add mobile-specific styles with @media queries
    - _Requirements: 2.1, 2.2, 2.3, 4.1, 4.2, 5.1, 5.2, 8.1, 8.2, 8.3_
  

  - [x] 8.2 Import chatbot styles in global CSS

    - Open app/assets/css/global.css
    - Add @import './chatbot.css';
    - _Requirements: 2.5, 4.1, 4.2_

- [ ]* 9. Testing and Validation
  - [ ]* 9.1 Test FAB functionality
    - Verify FAB appears on all pages
    - Test FAB click opens dialog
    - Test FAB positioning in LTR and RTL
    - Test FAB hover animation
    - Test FAB on mobile devices
    - _Requirements: 1.1, 1.5, 2.1, 2.2, 2.3, 8.3_
  
  - [ ]* 9.2 Test dialog functionality
    - Test dialog opens and closes correctly
    - Test message sending and receiving
    - Test loading indicator during API call
    - Test error message display
    - Test auto-scroll to latest message
    - Test input validation (empty message)
    - Test Enter key to send message
    - _Requirements: 1.2, 1.3, 3.1, 3.2, 3.4, 4.3, 4.4, 4.5, 6.1, 6.2_
  
  - [ ]* 9.3 Test i18n and RTL support
    - Switch to Arabic and verify all text translates
    - Verify RTL layout for dialog and messages
    - Verify FAB position changes for RTL
    - Switch back to English and verify LTR layout
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
  
  - [ ]* 9.4 Test responsive design
    - Test on mobile viewport (< 768px)
    - Verify fullscreen dialog on mobile
    - Test on tablet viewport (768px - 1024px)
    - Test on desktop viewport (> 1024px)
    - Verify fixed-width panel on desktop
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_
  
  - [ ]* 9.5 Test API integration
    - Send test message and verify AI response
    - Test with Arabic input
    - Test with English input
    - Test error handling (invalid API key)
    - Test conversation context (multiple messages)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 5.3, 7.1, 7.2, 7.3, 7.4_
  
  - [ ]* 9.6 Test error scenarios
    - Test network error handling
    - Test API timeout
    - Test invalid input
    - Test missing API key
    - Verify error messages display correctly
    - _Requirements: 3.4, 7.4_

- [ ]* 10. Documentation and Cleanup
  - [ ]* 10.1 Add code comments
    - Add JSDoc comments to store actions
    - Add comments to complex logic in components
    - Document API route parameters and responses
    - _Requirements: All_
  
  - [ ]* 10.2 Update project documentation
    - Add chatbot feature to README
    - Document environment variables needed
    - Add usage instructions
    - Add troubleshooting guide
    - _Requirements: All_
