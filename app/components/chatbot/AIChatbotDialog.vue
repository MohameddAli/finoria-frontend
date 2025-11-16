<template>
  <Teleport to="body">
    <transition name="chatbot-slide">
      <div v-if="modelValue" class="chatbot-overlay" :class="directionClass">
        <section class="chatbot-panel" aria-live="polite">
          <header class="chatbot-header">
            <div class="header-title">
              <v-avatar color="primary" variant="tonal" size="38">
                <v-icon>mdi-robot-outline</v-icon>
              </v-avatar>
              <div>
                <p class="header-kicker">{{ t("chatbot.assistantLabel") }}</p>
                <p class="header-title-text">{{ t("chatbot.title") }}</p>
              </div>
            </div>
            <div class="header-actions">
              <v-btn
                icon
                variant="text"
                size="small"
                :aria-label="t('chatbot.minimizeLabel')"
                @click="closeChat"
              >
                <v-icon>mdi-window-minimize</v-icon>
              </v-btn>
            </div>
          </header>

          <div class="chatbot-shortcuts" v-if="quickLinks.length">
            <div class="shortcuts-label">
              {{ t("chatbot.shortcuts.title") }}
            </div>
            <div class="shortcuts-row">
              <v-chip
                v-for="link in quickLinks"
                :key="link.to"
                size="small"
                variant="outlined"
                @click="navigate(link.to)"
              >
                <v-icon :icon="link.icon" size="16" class="me-1" />
                {{ link.label }}
              </v-chip>
            </div>
          </div>

          <section
            ref="messagesContainer"
            class="messages-container"
            role="log"
          >
            <div v-if="!messages.length && !isLoading" class="empty-state">
              <v-icon size="36">mdi-chat-processing-outline</v-icon>
              <p>{{ t("chatbot.noMessages") }}</p>
            </div>

            <div
              v-for="message in messages"
              :key="message.id"
              :class="messageClasses(message)"
            >
              <div class="message-content">
                <v-avatar
                  v-if="message.role === 'assistant'"
                  color="primary"
                  variant="tonal"
                  size="24"
                >
                  <v-icon size="16">mdi-robot</v-icon>
                </v-avatar>
                <div class="message-text">{{ message.content }}</div>
              </div>
              <div class="message-time">
                {{ formatTime(message.timestamp) }}
              </div>
            </div>

            <div v-if="isLoading" class="loading-message">
              <v-progress-circular indeterminate size="20" width="2" />
              <span>{{ t("chatbot.thinking") }}</span>
            </div>

            <v-alert
              v-if="error"
              type="error"
              density="compact"
              class="mt-2"
              closable
              @click:close="clearError"
            >
              {{ error }}
            </v-alert>
          </section>

          <footer class="input-area">
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
          </footer>
        </section>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  nextTick,
  onMounted,
  onBeforeUnmount,
} from "vue";
import { useChatStore } from "~/stores/chat";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

// Props and Emits
interface Props {
  modelValue: boolean;
}

interface Emits {
  (e: "update:modelValue", value: boolean): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Composables
const chatStore = useChatStore();
const { t, locale } = useI18n();
const router = useRouter();

// Refs
const userInput = ref("");
const messagesContainer = ref<HTMLElement | null>(null);

// Computed
const messages = computed(() => chatStore.messages);
const isLoading = computed(() => chatStore.isLoading);
const error = computed(() => chatStore.error);

const directionClass = computed(() =>
  locale.value === "ar" ? "chatbot-rtl" : "chatbot-ltr"
);

const quickLinks = computed(() => [
  {
    to: "/beneficiaries",
    icon: "mdi-hand-heart",
    label: t("chatbot.shortcuts.beneficiaries"),
  },
  { to: "/wallet", icon: "mdi-wallet", label: t("chatbot.shortcuts.wallet") },
  {
    to: "/cards",
    icon: "mdi-credit-card-chip",
    label: t("chatbot.shortcuts.cards"),
  },
  {
    to: "/support",
    icon: "mdi-lifebuoy",
    label: t("chatbot.shortcuts.support"),
  },
  {
    to: "/settings",
    icon: "mdi-cog-outline",
    label: t("chatbot.shortcuts.settings"),
  },
]);

// Methods
const closeChat = () => {
  emit("update:modelValue", false);
};

const navigate = (path: string) => {
  router.push(path);
};

const clearError = () => {
  chatStore.clearError();
};

const messageClasses = (message: any) => {
  return {
    message: true,
    "user-message": message.role === "user",
    "assistant-message": message.role === "assistant",
  };
};

const formatTime = (timestamp: Date) => {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat(locale.value, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return;

  const messageContent = userInput.value;
  userInput.value = ""; // Clear input immediately

  await chatStore.sendMessage(messageContent);
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape" && modelValue) {
    closeChat();
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
});

// Auto-scroll to latest message
watch(
  messages,
  async () => {
    await nextTick();
    if (messagesContainer.value) {
      messagesContainer.value.scrollTo({
        top: messagesContainer.value.scrollHeight,
        behavior: "smooth",
      });
    }
  },
  { deep: true }
);
</script>

<style scoped>
.chatbot-overlay {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 100%;
  pointer-events: none;
  z-index: 1100;
}

.chatbot-overlay.chatbot-ltr {
  direction: ltr;
}

.chatbot-overlay.chatbot-rtl {
  direction: rtl;
  right: auto;
  left: 0;
}

.chatbot-panel {
  position: absolute;
  bottom: 24px;
  right: 24px;
  width: min(420px, calc(100% - 32px));
  height: min(70vh, 640px);
  background: rgb(var(--v-theme-surface));
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.25);
  display: flex;
  flex-direction: column;
  pointer-events: auto;
  overflow: hidden;
}

.chatbot-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(var(--v-border-color), 0.2);
}

.header-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-kicker {
  font-size: 0.75rem;
  margin: 0;
  opacity: 0.7;
}

.header-title-text {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.chatbot-shortcuts {
  padding: 12px 20px 0;
}

.shortcuts-label {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.6;
  margin-bottom: 6px;
}

.shortcuts-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.messages-container {
  flex: 1;
  padding: 16px 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.empty-state {
  text-align: center;
  opacity: 0.7;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-top: 40px;
}

.message {
  display: flex;
  flex-direction: column;
  max-width: 85%;
}

.user-message {
  align-self: flex-end;
}

.user-message .message-content {
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
  border-radius: 16px 16px 4px 16px;
  padding: 10px 14px;
  word-break: break-word;
}

.assistant-message {
  align-self: flex-start;
}

.assistant-message .message-content {
  background: rgba(var(--v-theme-primary), 0.08);
  color: rgb(var(--v-theme-on-surface));
  border-radius: 16px 16px 16px 4px;
  padding: 10px 14px;
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.message-text {
  flex: 1;
}

.message-time {
  font-size: 0.72rem;
  opacity: 0.6;
  margin-top: 4px;
  padding: 0 6px;
}

.input-area {
  padding: 14px 16px;
  display: flex;
  gap: 8px;
  border-top: 1px solid rgba(var(--v-border-color), 0.2);
}

.loading-message {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 0.85rem;
  opacity: 0.8;
}

.chatbot-slide-enter-active,
.chatbot-slide-leave-active {
  transition: all 0.25s ease;
}

.chatbot-slide-enter-from,
.chatbot-slide-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

@media (max-width: 768px) {
  .chatbot-panel {
    width: calc(100% - 32px);
    height: calc(100vh - 32px);
    right: 16px;
    bottom: 16px;
  }

  .messages-container {
    max-width: 100%;
  }
}

.chatbot-overlay.chatbot-rtl .chatbot-panel {
  right: auto;
  left: 24px;
}

@media (max-width: 768px) {
  .chatbot-overlay.chatbot-rtl .chatbot-panel {
    left: 16px;
    right: auto;
  }
}

/* RTL adjustments */
.chatbot-overlay.chatbot-rtl .user-message {
  align-self: flex-start;
}

.chatbot-overlay.chatbot-rtl .assistant-message {
  align-self: flex-end;
}

.chatbot-overlay.chatbot-rtl .user-message .message-content {
  border-radius: 16px 16px 16px 4px;
}

.chatbot-overlay.chatbot-rtl .assistant-message .message-content {
  border-radius: 16px 16px 4px 16px;
}
</style>
