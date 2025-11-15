import { defineStore } from "pinia";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ChatState {
  messages: Message[];
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  sessionId: string | null;
}

export const useChatStore = defineStore("chat", () => {
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
      sessionId.value = `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Initialize session if needed
    initializeSession();

    // Add user message
    const userMessage: Message = {
      id: `msg_${Date.now()}_user`,
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };
    messages.value.push(userMessage);

    // Set loading state
    isLoading.value = true;
    error.value = null;

    try {
      // Call server API (using Gemini)
      const response = await $fetch<{ message: string; timestamp: string }>("/api/chat/gemini", {
        method: "POST",
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
        role: "assistant",
        content: response.message,
        timestamp: new Date(),
      };
      messages.value.push(aiMessage);
    } catch (err: any) {
      error.value = err.message || "Failed to get response from AI assistant";
      console.error("Chat error:", err);
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
