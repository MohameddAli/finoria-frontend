<template>
  <v-container>
    <v-card>
      <v-card-title>
        <h2>{{ $t('pagination.example') || 'مثال على الباجينيشن - Pagination Example' }}</h2>
      </v-card-title>
      
      <v-card-text>
        <!-- عرض البيانات - Display data -->
        <v-row>
          <v-col
            v-for="item in displayedItems"
            :key="item.id"
            cols="12"
            md="4"
          >
            <v-card>
              <v-card-title>{{ item.title }}</v-card-title>
              <v-card-text>{{ item.description }}</v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- مؤشر التحميل - Loading indicator -->
        <div v-if="isLoading" class="text-center my-4">
          <v-progress-circular indeterminate color="primary" />
          <p class="mt-2">{{ $t('loading') || 'جاري التحميل...' }}</p>
        </div>

        <!-- رسالة فارغة - Empty message -->
        <v-alert v-if="!isLoading && displayedItems.length === 0" type="info" class="my-4">
          {{ $t('noData') || 'لا توجد بيانات' }}
        </v-alert>
      </v-card-text>

      <!-- مكون الباجينيشن - Pagination component -->
      <v-card-actions class="justify-center">
        <Pagination
          :data="paginationData"
          :per-page="perPage"
          :total-visible="7"
          :align="alignmentValue"
          size="small"
          show-first-last
          @page-changed="handlePageChange"
        />
      </v-card-actions>
    </v-card>

    <!-- مثال على التخصيص - Customization example -->
    <v-card class="mt-4">
      <v-card-title>التخصيص - Customization</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-select
              v-model="perPage"
              :items="[5, 10, 20, 50]"
              label="عدد العناصر في الصفحة - Items per page"
              @update:model-value="handlePerPageChange"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="totalVisible"
              :items="[5, 7, 9, 11]"
              label="عدد الأزرار المرئية - Visible buttons"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="alignmentValue"
              :items="alignmentOptions"
              label="المحاذاة - Alignment"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- عرض أمثلة المحاذاة - Alignment examples -->
    <v-card class="mt-4">
      <v-card-title>أمثلة المحاذاة - Alignment Examples</v-card-title>
      <v-card-text>
        <div class="mb-6">
          <h3 class="mb-2">align="start" (البداية)</h3>
          <Pagination
            :page="1"
            :length="5"
            :total-items="50"
            align="start"
            show-first-last
          />
        </div>

        <div class="mb-6">
          <h3 class="mb-2">align="center" (الوسط)</h3>
          <Pagination
            :page="1"
            :length="5"
            :total-items="50"
            align="center"
            show-first-last
          />
        </div>

        <div class="mb-6">
          <h3 class="mb-2">align="end" (النهاية)</h3>
          <Pagination
            :page="1"
            :length="5"
            :total-items="50"
            align="end"
            show-first-last
          />
        </div>

        <div class="mb-6">
          <h3 class="mb-2">align="space-between" (التوزيع)</h3>
          <Pagination
            :page="1"
            :length="5"
            :total-items="50"
            align="space-between"
            show-first-last
          />
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
// @ts-nocheck
/**
 * مثال على استخدام مكون Pagination
 * Example of using the Pagination component
 */

const route = useRoute()
const router = useRouter()

// الحالة - State
const isLoading = ref(false)
const perPage = ref(10)
const totalVisible = ref(7)
const currentPage = ref(Number(route.query.page) || 1)
const alignmentValue = ref('end')

// خيارات المحاذاة - Alignment options
const alignmentOptions = [
  { value: 'start', title: 'Start - البداية' },
  { value: 'center', title: 'Center - الوسط' },
  { value: 'end', title: 'End - النهاية' },
  { value: 'space-between', title: 'Space Between - التوزيع' }
]

// بيانات وهمية - Mock data
const allItems = ref([])
const paginationData = ref({
  results: [],
  count: 0
})

// توليد بيانات وهمية - Generate mock data
const generateMockData = (total = 100) => {
  const items = []
  for (let i = 1; i <= total; i++) {
    items.push({
      id: i,
      title: `عنصر ${i} - Item ${i}`,
      description: `وصف العنصر ${i} - Description for item ${i}`
    })
  }
  return items
}

// البيانات المعروضة - Displayed items
const displayedItems = computed(() => paginationData.value.results || [])

// تحميل البيانات - Load data
const loadData = async (page = 1) => {
  isLoading.value = true
  
  try {
    // محاكاة تأخير API - Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // حساب النطاق - Calculate range
    const start = (page - 1) * perPage.value
    const end = start + perPage.value
    
    // تحديث البيانات - Update data
    paginationData.value = {
      results: allItems.value.slice(start, end),
      count: allItems.value.length
    }
  } catch (error) {
    console.error('خطأ في تحميل البيانات:', error)
  } finally {
    isLoading.value = false
  }
}

// معالج تغيير الصفحة - Page change handler
const handlePageChange = (page) => {
  currentPage.value = page
  
  // تحديث URL - Update URL
  router.push({
    query: { ...route.query, page }
  })
  
  // تحميل البيانات - Load data
  loadData(page)
}

// معالج تغيير عدد العناصر - Per page change handler
const handlePerPageChange = () => {
  currentPage.value = 1
  router.push({
    query: { ...route.query, page: 1 }
  })
  loadData(1)
}

// مراقبة تغيير route.query.page - Watch route.query.page
watch(() => route.query.page, (newPage) => {
  const page = Number(newPage) || 1
  if (page !== currentPage.value) {
    currentPage.value = page
    loadData(page)
  }
})

// التهيئة الأولية - Initial setup
onMounted(() => {
  // توليد بيانات وهمية - Generate mock data
  allItems.value = generateMockData(100)
  
  // تحميل الصفحة الأولى - Load first page
  loadData(currentPage.value)
})
</script>

<style scoped>
/* أنماط مخصصة - Custom styles */
.v-card {
  transition: all 0.3s ease;
}

.v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
