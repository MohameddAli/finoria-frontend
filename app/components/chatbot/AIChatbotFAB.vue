<template>
  <v-btn
    :class="fabClasses"
    color="primary"
    size="large"
    icon
    elevation="6"
    :aria-label="t('chatbot.title')"
    @click="toggleChat"
  >
    <v-icon size="28">mdi-robot-outline</v-icon>
  </v-btn>
</template>

<script setup lang="ts">
import { useChatStore } from "~/stores/chat";

/**
 * 🤖 AI Chatbot FAB (Floating Action Button)
 * ────────────────────────────────────────────────────────
 * Global floating button that provides access to the AI chatbot
 * from any page in the application.
 *
 * Features:
 * - Fixed positioning (bottom-right for LTR, bottom-left for RTL)
 * - Smooth hover animation
 * - Responsive positioning for mobile
 * - Z-index 1000 to stay above all content
 */

// Composables
const chatStore = useChatStore();
const { t, locale } = useI18n();

// Computed classes for RTL/LTR positioning
const fabClasses = computed(() => ({
  "chatbot-fab": true,
  "chatbot-fab-rtl": locale.value === "ar",
  "chatbot-fab-ltr": locale.value !== "ar",
}));

// Toggle chat dialog
const toggleChat = () => {
  chatStore.toggleChat();
};
</script>

<style scoped>
.chatbot-fab {
  position: fixed;
  bottom: 24px;
  z-index: 1000;
  transition: transform 0.2s ease;
}

.chatbot-fab:hover {
  transform: scale(1.1);
}

/* LTR positioning - bottom-right */
.chatbot-fab-ltr {
  right: 24px;
  left: auto;
}

/* RTL positioning - bottom-left */
.chatbot-fab-rtl {
  left: 24px;
  right: auto;
}

/* Mobile adjustments */
@media (max-width: 600px) {
  .chatbot-fab {
    bottom: 16px;
  }

  .chatbot-fab-ltr {
    right: 16px;
  }

  .chatbot-fab-rtl {
    left: 16px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .chatbot-fab {
    transition: none;
  }

  .chatbot-fab:hover {
    transform: none;
  }
}

/* Focus styles for accessibility */
.chatbot-fab:focus-visible {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}

/* Print styles - hide FAB when printing */
@media print {
  .chatbot-fab {
    display: none !important;
  }
}
</style>
