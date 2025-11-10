<template>
  <v-menu :location="location" :offset="offset" transition="fade-transition">
    <template #activator="{ props: activatorProps }">
      <v-btn v-bind="activatorProps" :variant="btnVariant" class="user-profile-btn">
        <div class="d-flex align-center">
          <v-avatar :size="avatarSize" class="me-2">
            <v-img :src="avatarSrc" :alt="avatarAlt" />
          </v-avatar>
          <div v-if="showUserInfo" class="user-info d-none d-sm-block">
            <div class="user-name text-body-2 font-weight-medium">
              {{ displayName }}
            </div>
            <div class="user-role text-caption text-medium-emphasis">
              {{ displayRole }}
            </div>
          </div>
          <v-icon class="ms-1">mdi-chevron-down</v-icon>
        </div>
      </v-btn>
    </template>

    <v-card class="user-menu-card" min-width="240" max-width="280">
      <v-list class="user-menu" density="comfortable">
        <v-list-item v-for="item in resolvedItems" :key="item.title" @click="item.action">
          <template #prepend>
            <v-icon>{{ item.icon }}</v-icon>
          </template>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">

const props = defineProps({
  name: { type: String, default: 'Robin Jivan' },
  role: { type: String, default: 'Admin' },
  avatar: { type: String, default: 'https://cdn.vuetifyjs.com/images/john.jpg' },
  avatarAlt: { type: String, default: 'User avatar' },
  showUserInfo: { type: Boolean, default: true },
  items: {
    type: Array,
    default: undefined,
    validator: (arr) => !arr || (Array.isArray(arr) && arr.every(i => i && typeof i.title === 'string' && typeof i.icon === 'string' && typeof i.action === 'function'))
  },
  location: {
    type: String,
    default: 'bottom end',
    validator: (v) => ['bottom end', 'bottom start', 'top end', 'top start'].includes(v)
  },
  offset: {
    type: Array,
    default: () => [0, 8],
    validator: (v) => Array.isArray(v) && v.length === 2 && v.every((n) => typeof n === 'number')
  },
  avatarSize: { type: [Number, String], default: 32 },
  btnVariant: {
    type: String,
    default: 'text',
    validator: (v) => ['text', 'elevated', 'flat', 'tonal', 'outlined', 'plain'].includes(v)
  }
})

const emit = defineEmits(['logout', 'navigate'])

const displayName = computed(() => props.name)
const displayRole = computed(() => props.role)
const avatarSrc = computed(() => props.avatar)

const navigate = (to) => emit('navigate', to)
const logout = () => emit('logout')

const { t } = useI18n()

const defaultItems = computed(() => [
  { title: t('header.profile'), icon: 'mdi-account-outline', action: () => navigate('/profile') },
  { title: t('navigation.settings'), icon: 'mdi-cog-outline', action: () => navigate('/settings') },
  { title: t('navigation.support'), icon: 'mdi-help-circle-outline', action: () => navigate('/support') },
  { title: t('header.logout'), icon: 'mdi-logout', action: logout },
])

const resolvedItems = computed(() => props.items ?? defaultItems.value)
</script>

<style scoped>
.user-profile-btn {
  border-radius: 12px;
  padding: 4px 8px;
  text-transform: none;
  background-color: rgba(var(--v-theme-surface-variant), 0.6);
  height: 40px;
}

.user-menu {
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.user-menu-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.user-info {
  text-align: start;
}

@media (max-width: 600px) {
  .user-info { display: none !important; }
}
</style>


