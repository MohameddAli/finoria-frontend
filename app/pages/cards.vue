<template>
  <v-container id="Orders" fluid tag="section">
    <v-card class="my-4 mx-auto w-100" rounded="lg">
      <v-card-title class="d-flex align-center justify-space-between">
        <div class="text-h6">{{ $t('pages.cards.title') }}</div>
        <v-btn color="primary" variant="flat" @click="resetFilters">
          <v-icon class="mr-1">mdi-filter-remove</v-icon>
          {{ $t('options.clear_filters') || 'Clear filters' }}
        </v-btn>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-form @submit.prevent>
          <v-row>
            <v-col cols="12" sm="4">
              <v-text-field
                v-model.trim="filters.search"
                :label="$t('pages.cards.search')"
                prepend-inner-icon="mdi-magnify"
                clearable
              />
            </v-col>
            <v-col cols="12" sm="4">
              <v-select
                v-model="filters.category"
                :items="categories"
                :label="$t('pages.cards.category')"
                clearable
              />
            </v-col>
            <v-col cols="12" sm="4">
              <v-select
                v-model="filters.status"
                :items="statuses"
                :label="$t('pages.cards.status')"
                clearable
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider />
      <v-card-text>
        <v-row>
          <v-col v-for="card in filteredCards" :key="card.id" cols="12" sm="6" md="4" lg="3">
            <v-card rounded="lg" :elevation="2" height="320" class="d-flex flex-column">
              <v-img :src="card.image" height="140" cover />
              <v-card-title class="text-subtitle-1">{{ card.title }}</v-card-title>
              <v-card-subtitle>{{ card.category }} • {{ card.status }}</v-card-subtitle>
              <v-card-text class="text-body-2 flex-grow-1">{{ card.description }}</v-card-text>
              <v-card-actions class="mt-auto">
                <v-btn variant="text" color="primary">{{ $t('common.view') || 'View' }}</v-btn>
                <v-spacer />
                <v-chip :color="card.status === 'Active' ? 'success' : 'warning'" size="small" label>
                  {{ card.status }}
                </v-chip>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
  
</template>

<script setup lang="ts">
// 🔒 صفحة محمية
definePageMeta({
  layout: 'dashboard',
  title: 'pages.cards.title',
  subtitle: 'pages.cards.subtitle'
})

const categories = ['Finance', 'Marketing', 'Operations', 'HR']
const statuses = ['Active', 'Draft', 'Archived']

const filters = reactive({
  search: '',
  category: undefined,
  status: undefined,
})

const items = ref([
  { id: 1, title: 'Corporate Card', category: 'Finance', status: 'Active', description: 'Company-wide corporate card.', image: 'https://picsum.photos/seed/1/400/200' },
  { id: 2, title: 'Travel Card', category: 'Operations', status: 'Draft', description: 'Used for company travel expenses.', image: 'https://picsum.photos/seed/2/400/200' },
  { id: 3, title: 'Rewards Card', category: 'Marketing', status: 'Active', description: 'Card with strong rewards program.', image: 'https://picsum.photos/seed/3/400/200' },
  { id: 4, title: 'Procurement Card', category: 'Operations', status: 'Archived', description: 'Purchasing and procurement.', image: 'https://picsum.photos/seed/4/400/200' },
])

const filteredCards = computed(() => {
  const q = filters.search?.toLowerCase() || ''
  return items.value.filter(c => {
    const matchQ = !q || c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
    const matchCat = !filters.category || c.category === filters.category
    const matchStatus = !filters.status || c.status === filters.status
    return matchQ && matchCat && matchStatus
  })
})

const resetFilters = () => {
  filters.search = ''
  filters.category = undefined
  filters.status = undefined
}
</script>
