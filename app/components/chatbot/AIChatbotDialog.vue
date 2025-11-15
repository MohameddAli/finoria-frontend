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

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import { useChatStore } from '~/stores/chat';
import { useI18n } from 'vue-i18n';
import { useDisplay } from 'vuetify';

// Props and Emits
interface Props {
  modelValue: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Composables
const chatStore = useChatStore();
const { t, locale } = useI18n();
const { mobile } = useDisplay();

// Refs
const userInput = ref('');
const messagesContainer = ref<HTMLElement | null>(null);

// Computed
const messages = computed(() => chatStore.messages);
const isLoading = computed(() => chatStore.isLoading);
const error = computed(() => chatStore.error);
const isMobile = computed(() => mobile.value);

// Dialog transition based on locale (RTL/LTR)
const dialogTransition = computed(() => {
  return locale.value === 'ar' ? 'dialog-left-transition' : 'dialog-right-transition';
});

// Methods
const closeChat = () => {
  emit('update:modelValue', false);
};

const clearError = () => {
  chatStore.clearError();
};

const messageClasses = (message: any) => {
  return {
    'message': true,
    'user-message': message.role === 'user',
    'assistant-message': message.role === 'assistant',
  };
};

const formatTime = (timestamp: Date) => {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat(locale.value, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return;
  
  const messageContent = userInput.value;
  userInput.value = ''; // Clear input immediately
  
  await chatStore.sendMessage(messageContent);
};

// Auto-scroll to latest message
watch(messages, async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTo({
      top: messagesContainer.value.scrollHeight,
      behavior: 'smooth',
    });
  }
}, { deep: true });
</script>

<style scoped>
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
}

.user-message {
  align-self: flex-end;
}

.user-message .message-content {
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
  border-radius: 16px 16px 4px 16px;
  padding: 12px 16px;
  word-wrap: break-word;
}

.assistant-message {
  align-self: flex-start;
}

.assistant-message .message-content {
  background: rgb(var(--v-theme-surface-variant));
  color: rgb(var(--v-theme-on-surface-variant));
  border-radius: 16px 16px 16px 4px;
  display: flex;
  gap: 8px;
  align-items: flex-start;
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

/* RTL Support */
[dir="rtl"] .user-message {
  align-self: flex-start;
}

[dir="rtl"] .user-message .message-content {
  border-radius: 16px 16px 16px 4px;
}

[dir="rtl"] .assistant-message {
  align-self: flex-end;
}

[dir="rtl"] .assistant-message .message-content {
  border-radius: 16px 16px 4px 16px;
}

/* Mobile Adjustments */
@media (max-width: 768px) {
  .message {
    max-width: 90%;
  }
  
  .input-area {
    padding: 12px;
  }
}
</style>
