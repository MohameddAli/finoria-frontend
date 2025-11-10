<template>
  <v-container fluid class="pa-0 wallet-page" id="wallet-page">
    <!-- App Bar -->
    <v-app-bar flat color="transparent" density="comfortable" class="px-4 py-2">
      <v-app-bar-title class="text-h6 font-weight-bold">محفظتي الإلكترونية</v-app-bar-title>
      <v-spacer />
      <v-btn color="success" variant="flat" prepend-icon="mdi-bank-transfer-in" class="mx-1" @click="openDeposit">إيداع</v-btn>
      <v-btn color="error" variant="flat" prepend-icon="mdi-bank-transfer-out" class="mx-1" @click="openWithdraw">سحب</v-btn>
      <v-btn color="primary" variant="flat" prepend-icon="mdi-swap-horizontal" class="mx-1" @click="openTransfer">حوالة</v-btn>
    </v-app-bar>

    <!-- Wallets Slider + Controls -->
    <div class="px-4">
      <v-card class="rounded-2xl gradient-card mb-3" variant="elevated">
        <v-card-text class="d-flex align-center justify-space-between flex-wrap ga-3">
          <div class="d-flex align-center ga-3">
            <v-select
              v-model="displayLang"
              :items="[{ label: 'العربية', value: 'ar' }, { label: 'English', value: 'en' }]"
              item-title="label" item-value="value"
              hide-details density="comfortable" variant="outlined"
              style="min-width: 160px"
              label="عرض أسماء العملات"
            />
            <v-select
              v-model="currencyFilter"
              :items="currencyOptions"
              label="فلتر العملة"
              hide-details density="comfortable" variant="outlined"
              clearable style="min-width: 180px"
            />
            <v-chip-group v-model="typeFilter" multiple selected-class="text-white">
              <v-chip value="deposit" variant="elevated" size="small">إيداع</v-chip>
              <v-chip value="withdrawal" variant="elevated" size="small">سحب</v-chip>
              <v-chip value="transfer" variant="elevated" size="small">حوالة</v-chip>
              <v-chip value="payment" variant="elevated" size="small">دفع</v-chip>
            </v-chip-group>
          </div>
          <v-text-field v-model="search" variant="outlined" density="comfortable" hide-details prepend-inner-icon="mdi-magnify" placeholder="ابحث في الحركات (وصف، مرسل/مستقبل)" style="min-width: 280px" />
        </v-card-text>
      </v-card>

      <!-- Currency carousel: v-window + chips navigation -->
      <div class="wallet-carousel">
        <v-btn class="nav-btn" icon variant="tonal" @click="prev"><v-icon>mdi-chevron-right</v-icon></v-btn>
        <v-window v-model="activeIndex" show-arrows="hover" class="rounded-xl" :touch="{ left: () => next(), right: () => prev() }">
          <v-window-item v-for="(w, i) in wallets" :key="w.code" :value="i">
            <v-card class="rounded-xl wallet-card" :class="`theme-${w.theme}`" variant="flat">
              <v-card-text class="wallet-body">
                <div class="d-flex align-center justify-space-between">
                  <div class="d-flex align-center ga-3">
                    <v-avatar size="44" class="elevation-1"><v-img :src="w.logo" cover /></v-avatar>
                    <div>
                      <div class="text-h6 font-weight-bold">{{ currencyDisplayName(w.code) }}</div>
                      <div class="text-caption text-medium-emphasis">{{ w.code }} • {{ w.iban }}</div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-caption text-medium-emphasis">الرصيد المتاح</div>
                    <div class="text-h4 font-weight-bold">{{ fmt(w.balance, w.code) }}</div>
                  </div>
                </div>
                <div class="mt-4 d-flex align-center justify-space-between flex-wrap ga-3">
                  <div class="d-flex align-center ga-2">
                    <v-chip size="small" variant="flat">مجمّد: {{ fmt(w.hold, w.code) }}</v-chip>
                    <v-chip size="small" variant="flat">آخِر تحديث: {{ formatRelative(w.updatedAt) }}</v-chip>
                  </div>
                  <div class="d-flex align-center ga-2">
                    <v-btn size="small" color="success" variant="flat" prepend-icon="mdi-bank-transfer-in" @click="openDeposit(w)">إيداع</v-btn>
                    <v-btn size="small" color="error" variant="flat" prepend-icon="mdi-bank-transfer-out" @click="openWithdraw(w)">سحب</v-btn>
                    <v-btn size="small" color="primary" variant="flat" prepend-icon="mdi-swap-horizontal" @click="openTransfer(w)">حوالة</v-btn>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-window-item>
        </v-window>
        <v-btn class="nav-btn" icon variant="tonal" @click="next"><v-icon>mdi-chevron-left</v-icon></v-btn>
      </div>

      <!-- Currency quick nav -->
      <div class="mt-2 d-flex align-center justify-center">
        <v-slide-group v-model="activeIndex" center-active show-arrows class="px-2" mandatory>
          <v-slide-group-item v-for="(w,i) in wallets" :key="w.code" :value="i">
            <v-chip class="mx-1" :color="activeIndex===i ? 'primary' : undefined" variant="tonal" size="small">{{ w.code }}</v-chip>
          </v-slide-group-item>
        </v-slide-group>
      </div>
    </div>

    <!-- Transactions Table -->
    <v-container fluid class="px-4 pb-8 mt-4">
      <v-card class="rounded-2xl" variant="elevated">
        <v-tabs v-model="activeTab" class="px-4 pt-2" color="primary">
          <v-tab value="transactions">الحركات</v-tab>
          <v-tab value="salaries">الرواتب الواردة</v-tab>
          <v-tab value="transfers">الحوالات</v-tab>
          <v-tab value="installments">الأقساط</v-tab>
        </v-tabs>
        <v-divider />
        
        <v-window v-model="activeTab">
          <!-- Transactions Tab -->
          <v-window-item value="transactions">
            <v-card-title class="d-flex align-center justify-space-between">
              <div>الحركات</div>
              <div class="text-medium-emphasis text-caption">{{ filteredTx.length }} عملية</div>
            </v-card-title>
            <v-data-table
              :headers="headers"
              :items="pagedTx"
              :items-length="filteredTx.length"
              v-model:page="page"
              :items-per-page="pageSize"
              item-key="id"
              class="wallet-table"
              fixed-header
              height="520"
              :sort-by="[{ key: 'date', order: 'desc' }]"
            >
              <template #item.amount="{ item }">
                <span :class="amountClass(item)">{{ fmt(item.amount, item.currency) }}</span>
              </template>
              <template #item.type="{ item }">
                <v-chip size="x-small" :color="typeColor(item.type)" variant="flat">{{ typeLabel(item.type) }}</v-chip>
              </template>
              <template #item.status="{ item }">
                <v-chip size="x-small" :color="statusColor(item.status)" variant="tonal">{{ statusLabel(item.status) }}</v-chip>
              </template>
              <template #item.date="{ item }">
                <span class="text-no-wrap">{{ formatDate(item.date) }}</span>
              </template>
              <template #bottom>
                <div class="d-flex align-center justify-space-between px-4 py-2">
                  <div class="text-medium-emphasis text-caption">إجمالي الصفحة: <strong>{{ fmt(pageTotal, currencyFilter || wallets[activeIndex]?.code || 'LYD') }}</strong></div>
                  <v-pagination v-model="page" :length="pages" total-visible="7" rounded="circle" />
                </div>
              </template>
            </v-data-table>

            <!-- Empty state -->
            <div v-if="!filteredTx.length" class="text-center py-10">
              <v-icon size="40" class="mb-2">mdi-file-chart</v-icon>
              <div class="text-subtitle-1 font-weight-medium mb-1">لا توجد حركات مطابقة</div>
              <div class="text-medium-emphasis mb-4">جرّب توسيع نطاق البحث أو إزالة بعض الفلاتر.</div>
              <v-btn variant="tonal" prepend-icon="mdi-filter-off" @click="resetFilters">إزالة الفلاتر</v-btn>
            </div>
          </v-window-item>

          <!-- Salaries Tab -->
          <v-window-item value="salaries">
            <v-card-title class="d-flex align-center justify-space-between">
              <div>الرواتب الواردة</div>
              <div class="text-medium-emphasis text-caption">{{ filteredSalaries.length }} راتب</div>
            </v-card-title>
            
            <v-data-table
              :headers="salaryHeaders"
              :items="pagedSalaries"
              :items-length="filteredSalaries.length"
              v-model:page="salaryPage"
              :items-per-page="pageSize"
              item-key="id"
              class="wallet-table"
              fixed-header
              height="520"
              :sort-by="[{ key: 'date', order: 'desc' }]"
            >
              <template #item.amount="{ item }">
                <span class="pos">{{ fmt(item.amount, item.currency) }}</span>
              </template>
              <template #item.status="{ item }">
                <v-chip size="x-small" :color="statusColor(item.status)" variant="tonal">{{ statusLabel(item.status) }}</v-chip>
              </template>
              <template #item.date="{ item }">
                <span class="text-no-wrap">{{ formatDate(item.date) }}</span>
              </template>
              <template #item.employer="{ item }">
                <div class="d-flex align-center ga-2">
                  <v-avatar size="28" color="primary">
                    <v-icon size="18">mdi-domain</v-icon>
                  </v-avatar>
                  <span>{{ item.employer }}</span>
                </div>
              </template>
              <template #bottom>
                <div class="d-flex align-center justify-space-between px-4 py-2">
                  <div class="text-medium-emphasis text-caption">إجمالي الصفحة: <strong>{{ fmt(salaryPageTotal, currencyFilter || 'LYD') }}</strong></div>
                  <v-pagination v-model="salaryPage" :length="salaryPages" total-visible="7" rounded="circle" />
                </div>
              </template>
            </v-data-table>

            <!-- Empty state -->
            <div v-if="!filteredSalaries.length" class="text-center py-10">
              <v-icon size="40" class="mb-2">mdi-cash-multiple</v-icon>
              <div class="text-subtitle-1 font-weight-medium mb-1">لا توجد رواتب مطابقة</div>
              <div class="text-medium-emphasis mb-4">جرّب توسيع نطاق البحث أو إزالة الفلاتر.</div>
              <v-btn variant="tonal" prepend-icon="mdi-filter-off" @click="resetFilters">إزالة الفلاتر</v-btn>
            </div>
          </v-window-item>

          <!-- Transfers Tab -->
          <v-window-item value="transfers">
            <v-card-title class="d-flex align-center justify-space-between">
              <div>الحوالات</div>
              <div class="text-medium-emphasis text-caption">{{ filteredTransfers.length }} حوالة</div>
            </v-card-title>
            
            <v-data-table
              :headers="transferHeaders"
              :items="pagedTransfers"
              :items-length="filteredTransfers.length"
              v-model:page="transferPage"
              :items-per-page="pageSize"
              item-key="id"
              class="wallet-table"
              fixed-header
              height="520"
              :sort-by="[{ key: 'date', order: 'desc' }]"
            >
              <template #item.amount="{ item }">
                <span :class="item.from.includes('محفظتي') ? 'neg' : 'pos'">{{ fmt(item.amount, item.currency) }}</span>
              </template>
              <template #item.status="{ item }">
                <v-chip size="x-small" :color="statusColor(item.status)" variant="tonal">{{ statusLabel(item.status) }}</v-chip>
              </template>
              <template #item.date="{ item }">
                <span class="text-no-wrap">{{ formatDate(item.date) }}</span>
              </template>
              <template #item.from="{ item }">
                <div class="d-flex align-center ga-2">
                  <v-icon size="20" :color="item.from.includes('محفظتي') ? 'error' : 'success'">mdi-arrow-up-circle</v-icon>
                  <span>{{ item.from }}</span>
                </div>
              </template>
              <template #item.to="{ item }">
                <div class="d-flex align-center ga-2">
                  <v-icon size="20" :color="item.to.includes('محفظتي') ? 'success' : 'error'">mdi-arrow-down-circle</v-icon>
                  <span>{{ item.to }}</span>
                </div>
              </template>
              <template #bottom>
                <div class="d-flex align-center justify-space-between px-4 py-2">
                  <div class="text-medium-emphasis text-caption">إجمالي الصفحة: <strong>{{ fmt(transferPageTotal, currencyFilter || 'LYD') }}</strong></div>
                  <v-pagination v-model="transferPage" :length="transferPages" total-visible="7" rounded="circle" />
                </div>
              </template>
            </v-data-table>

            <!-- Empty state -->
            <div v-if="!filteredTransfers.length" class="text-center py-10">
              <v-icon size="40" class="mb-2">mdi-bank-transfer</v-icon>
              <div class="text-subtitle-1 font-weight-medium mb-1">لا توجد حوالات مطابقة</div>
              <div class="text-medium-emphasis mb-4">جرّب توسيع نطاق البحث أو إزالة الفلاتر.</div>
              <v-btn variant="tonal" prepend-icon="mdi-filter-off" @click="resetFilters">إزالة الفلاتر</v-btn>
            </div>
          </v-window-item>

          <!-- Installments Tab -->
          <v-window-item value="installments">
            <v-card-title class="d-flex align-center justify-space-between">
              <div>الأقساط</div>
              <div class="text-medium-emphasis text-caption">{{ filteredInstallments.length }} خطة تقسيط</div>
            </v-card-title>
            
            <v-data-table
              :headers="installmentHeaders"
              :items="pagedInstallments"
              :items-length="filteredInstallments.length"
              v-model:page="installmentPage"
              :items-per-page="pageSize"
              item-key="id"
              class="wallet-table"
              fixed-header
              height="520"
              :sort-by="[{ key: 'createdAt', order: 'desc' }]"
            >
              <template #item.productName="{ item }">
                <div>
                  <div class="font-weight-medium">{{ item.productName }}</div>
                  <div class="text-caption text-medium-emphasis">{{ item.currency }}</div>
                </div>
              </template>
              <template #item.totalAmount="{ item }">
                <span class="font-weight-medium">{{ fmt(item.totalAmount, item.currency) }}</span>
              </template>
              <template #item.downPayment="{ item }">
                <div>
                  <div>{{ fmt(item.downPayment, item.currency) }}</div>
                  <v-chip v-if="item.downPaymentFrozen" size="x-small" color="orange" variant="tonal" class="mt-1">
                    <v-icon start size="12">mdi-lock</v-icon>
                    مجمد
                  </v-chip>
                </div>
              </template>
              <template #item.remainingAmount="{ item }">
                <span :class="item.remainingAmount > 0 ? 'text-error font-weight-bold' : 'text-success'">{{ fmt(item.remainingAmount, item.currency) }}</span>
              </template>
              <template #item.installmentAmount="{ item }">
                <span class="text-medium-emphasis">{{ fmt(item.installmentAmount, item.currency) }}</span>
              </template>
              <template #item.progress="{ item }">
                <div style="min-width: 140px">
                  <div class="d-flex align-center justify-space-between mb-1">
                    <span class="text-caption">{{ item.paidInstallments }}/{{ item.totalInstallments }}</span>
                    <span class="text-caption font-weight-bold">{{ installmentProgress(item) }}%</span>
                  </div>
                  <v-progress-linear
                    :model-value="installmentProgress(item)"
                    :color="item.status === 'completed' ? 'success' : item.status === 'active' ? 'primary' : 'orange'"
                    height="6"
                    rounded
                  />
                </div>
              </template>
              <template #item.nextDueDate="{ item }">
                <div v-if="item.status !== 'completed'">
                  <div class="text-caption">{{ formatDate(item.nextDueDate) }}</div>
                  <v-chip size="x-small" :color="item.nextDueDate < Date.now() ? 'error' : 'primary'" variant="tonal" class="mt-1">
                    {{ daysUntilDue(item.nextDueDate) }}
                  </v-chip>
                </div>
                <span v-else class="text-medium-emphasis">—</span>
              </template>
              <template #item.status="{ item }">
                <v-chip size="x-small" :color="installmentStatusColor(item.status)" variant="tonal">
                  {{ installmentStatusLabel(item.status) }}
                </v-chip>
              </template>
              <template #bottom>
                <div class="d-flex align-center justify-space-between px-4 py-2">
                  <div class="text-medium-emphasis text-caption">إجمالي المتبقي: <strong>{{ fmt(installmentPageTotal, currencyFilter || 'LYD') }}</strong></div>
                  <v-pagination v-model="installmentPage" :length="installmentPages" total-visible="7" rounded="circle" />
                </div>
              </template>
            </v-data-table>

            <!-- Empty state -->
            <div v-if="!filteredInstallments.length" class="text-center py-10">
              <v-icon size="40" class="mb-2">mdi-credit-card-clock</v-icon>
              <div class="text-subtitle-1 font-weight-medium mb-1">لا توجد أقساط مطابقة</div>
              <div class="text-medium-emphasis mb-4">جرّب توسيع نطاق البحث أو إزالة الفلاتر.</div>
              <v-btn variant="tonal" prepend-icon="mdi-filter-off" @click="resetFilters">إزالة الفلاتر</v-btn>
            </div>
          </v-window-item>
        </v-window>
      </v-card>
    </v-container>

    <!-- Dialogs (stubs) -->
    <v-dialog v-model="depositOpen" max-width="520">
      <v-card>
        <v-card-title>إيداع</v-card-title>
        <v-card-text>
          <v-text-field v-model.number="form.amount" label="المبلغ" type="number" prepend-inner-icon="mdi-cash" />
          <v-select v-model="form.currency" :items="currencyOptions" label="العملة" />
          <v-text-field v-model="form.note" label="ملاحظة" />
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="depositOpen=false">إلغاء</v-btn>
          <v-btn color="success" @click="submit('deposit')">تأكيد</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="withdrawOpen" max-width="520">
      <v-card>
        <v-card-title>سحب</v-card-title>
        <v-card-text>
          <v-text-field v-model.number="form.amount" label="المبلغ" type="number" prepend-inner-icon="mdi-cash-remove" />
          <v-select v-model="form.currency" :items="currencyOptions" label="العملة" />
          <v-text-field v-model="form.note" label="ملاحظة" />
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="withdrawOpen=false">إلغاء</v-btn>
          <v-btn color="error" @click="submit('withdrawal')">تأكيد</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="transferOpen" max-width="520">
      <v-card>
        <v-card-title>حوالة</v-card-title>
        <v-card-text>
          <v-text-field v-model="form.to" label="إلى (رقم/محفظة)" prepend-inner-icon="mdi-account-arrow-right" />
          <v-text-field v-model.number="form.amount" label="المبلغ" type="number" prepend-inner-icon="mdi-swap-horizontal" />
          <v-select v-model="form.currency" :items="currencyOptions" label="العملة" />
          <v-text-field v-model="form.note" label="ملاحظة" />
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="transferOpen=false">إلغاء</v-btn>
          <v-btn color="primary" @click="submit('transfer')">تأكيد</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
/**
 * Wallet Page - Multi-Currency Wallet Management
 * Professional Arabic UI with wallet carousel, transaction filtering, and operations
 */

import { ref, computed } from 'vue'

definePageMeta({
  layout: 'dashboard'
});

// ═══════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════

/**
 * Transaction types
 */
type TxType = 'deposit' | 'withdrawal' | 'transfer' | 'payment';

/**
 * Transaction status
 */
type TxStatus = 'completed' | 'pending' | 'failed';

/**
 * Wallet interface
 */
interface Wallet {
  code: string;
  theme: 'blue' | 'green' | 'purple' | 'amber';
  balance: number;
  hold: number;
  updatedAt: number;
  iban: string;
  logo: string;
}

/**
 * Transaction interface
 */
interface Tx {
  id: string;
  date: number;
  type: TxType;
  status: TxStatus;
  currency: string;
  amount: number;
  description: string;
  counterparty?: string;
}

/**
 * Salary interface
 */
interface Salary {
  id: string;
  date: number;
  status: TxStatus;
  currency: string;
  amount: number;
  employer: string;
  month: string;
  year: number;
  notes?: string;
}

/**
 * Transfer interface
 */
interface Transfer {
  id: string;
  date: number;
  status: TxStatus;
  currency: string;
  amount: number;
  from: string;
  to: string;
  reference?: string;
  notes?: string;
}

/**
 * Installment interface
 */
interface Installment {
  id: string;
  purchaseId: string;
  productName: string;
  totalAmount: number;
  downPayment: number;
  downPaymentFrozen: boolean;
  remainingAmount: number;
  installmentAmount: number;
  paidInstallments: number;
  totalInstallments: number;
  nextDueDate: number;
  currency: string;
  status: 'active' | 'completed' | 'frozen' | 'defaulted';
  createdAt: number;
  notes?: string;
}


// ═══════════════════════════════════════════════
// State - Locale & Display Settings
// ═══════════════════════════════════════════════

/**
 * Display language for currency names and dates
 */
const displayLang = ref<'ar' | 'en'>('ar');

/**
 * Locale computed based on display language
 */
const locale = computed(() => displayLang.value === 'ar' ? 'ar-LY' : 'en-US');

// ═══════════════════════════════════════════════
// State - Wallets Data
// ═══════════════════════════════════════════════

/**
 * Sample wallets data
 * TODO: Replace with API call
 */
const wallets = ref<Wallet[]>([
  { code: 'LYD', theme: 'blue', balance: 12500.75, hold: 350, updatedAt: Date.now(), iban: 'LY12 3456 7890 1234', logo: 'https://flagcdn.com/w40/ly.png' },
  { code: 'USD', theme: 'green', balance: 4200.5, hold: 0, updatedAt: Date.now(), iban: 'US12 3456 7890 1234', logo: 'https://flagcdn.com/w40/us.png' },
]);

// ═══════════════════════════════════════════════
// State - Carousel
// ═══════════════════════════════════════════════

/**
 * Active wallet index in carousel
 */
const activeIndex = ref(0);

/**
 * Navigate to previous wallet
 */
function prev() {
  activeIndex.value = (activeIndex.value - 1 + wallets.value.length) % wallets.value.length;
}

/**
 * Navigate to next wallet
 */
function next() {
  activeIndex.value = (activeIndex.value + 1) % wallets.value.length;
}

// ═══════════════════════════════════════════════
// State - Tabs
// ═══════════════════════════════════════════════

/**
 * Active tab (transactions, salaries, transfers, or installments)
 */
const activeTab = ref('transactions');

// ═══════════════════════════════════════════════
// State - Filters
// ═══════════════════════════════════════════════

/**
 * Search query for transactions
 */
const search = ref('');

/**
 * Currency filter
 */
const currencyFilter = ref<string | null>(null);

/**
 * Transaction type filter
 */
const typeFilter = ref<TxType[]>([]);

// ═══════════════════════════════════════════════
// State - Transactions Data
// ═══════════════════════════════════════════════

/**
 * Sample transactions data
 * TODO: Replace with API call
 */
const allTx = ref<Tx[]>([
  mkTx('deposit', 'completed', 'LYD', 1500, 'إيداع عبر الفرع'),
  mkTx('withdrawal', 'completed', 'LYD', -300, 'سحب نقدي'),
  mkTx('transfer', 'pending', 'USD', -120, 'حوالة إلى أحمد'),
  mkTx('payment', 'completed', 'EUR', -45.99, 'دفع فاتورة إنترنت'),
  mkTx('deposit', 'completed', 'USD', 2300, 'تحويل وارد'),
  mkTx('withdrawal', 'failed', 'GBP', -200, 'سحب من الصراف'),
  mkTx('payment', 'completed', 'LYD', -75, 'مطعم'),
]);

/**
 * Helper function to create a transaction
 */
function mkTx(type: TxType, status: TxStatus, currency: string, amount: number, description: string): Tx {
  return {
    id: Math.random().toString(36).slice(2),
    date: Date.now() - Math.floor(Math.random() * 7 * 24 * 3600 * 1000),
    type,
    status,
    currency,
    amount,
    description
  };
}

// ═══════════════════════════════════════════════
// State - Salaries Data
// ═══════════════════════════════════════════════

/**
 * Sample salaries data
 * TODO: Replace with API call
 */
const allSalaries = ref<Salary[]>([
  { id: '1', date: new Date(2025, 9, 25).getTime(), status: 'completed', currency: 'LYD', amount: 3500, employer: 'شركة النفط الوطنية', month: 'أكتوبر', year: 2025, notes: 'راتب شهر أكتوبر' },
  { id: '2', date: new Date(2025, 8, 25).getTime(), status: 'completed', currency: 'LYD', amount: 3500, employer: 'شركة النفط الوطنية', month: 'سبتمبر', year: 2025 },
  { id: '3', date: new Date(2025, 7, 25).getTime(), status: 'completed', currency: 'LYD', amount: 3500, employer: 'شركة النفط الوطنية', month: 'أغسطس', year: 2025 },
  { id: '4', date: new Date(2025, 6, 25).getTime(), status: 'completed', currency: 'LYD', amount: 3200, employer: 'شركة النفط الوطنية', month: 'يوليو', year: 2025 },
  { id: '5', date: new Date(2025, 5, 25).getTime(), status: 'completed', currency: 'USD', amount: 800, employer: 'مؤسسة الاستشارات الدولية', month: 'يونيو', year: 2025, notes: 'راتب استشارات' },
  { id: '6', date: new Date(2025, 4, 25).getTime(), status: 'pending', currency: 'LYD', amount: 3500, employer: 'شركة النفط الوطنية', month: 'مايو', year: 2025 },
]);

// ═══════════════════════════════════════════════
// State - Transfers Data
// ═══════════════════════════════════════════════

/**
 * Sample transfers data
 * TODO: Replace with API call
 */
const allTransfers = ref<Transfer[]>([
  { id: 't1', date: Date.now() - 2 * 3600000, status: 'completed', currency: 'LYD', amount: 500, from: 'محفظتي (LYD)', to: 'أحمد علي', reference: 'REF-2025-001', notes: 'حوالة عائلية' },
  { id: 't2', date: Date.now() - 24 * 3600000, status: 'completed', currency: 'USD', amount: 200, from: 'محفظتي (USD)', to: 'محمد حسن', reference: 'REF-2025-002' },
  { id: 't3', date: Date.now() - 48 * 3600000, status: 'pending', currency: 'LYD', amount: 750, from: 'محفظتي (LYD)', to: 'فاطمة سالم', reference: 'REF-2025-003', notes: 'قيد المعالجة' },
  { id: 't4', date: Date.now() - 72 * 3600000, status: 'completed', currency: 'LYD', amount: 1200, from: 'خالد محمود', to: 'محفظتي (LYD)', reference: 'REF-2025-004', notes: 'حوالة واردة' },
  { id: 't5', date: Date.now() - 96 * 3600000, status: 'failed', currency: 'USD', amount: 300, from: 'محفظتي (USD)', to: 'سارة أحمد', reference: 'REF-2025-005', notes: 'رصيد غير كافٍ' },
]);

// ═══════════════════════════════════════════════
// State - Installments Data
// ═══════════════════════════════════════════════

/**
 * Sample installments data
 * TODO: Replace with API call
 */
const allInstallments = ref<Installment[]>([
  {
    id: 'i1',
    purchaseId: 'PUR-2025-001',
    productName: 'لابتوب Dell XPS 15',
    totalAmount: 5000,
    downPayment: 1000,
    downPaymentFrozen: true,
    remainingAmount: 4000,
    installmentAmount: 500,
    paidInstallments: 2,
    totalInstallments: 8,
    nextDueDate: Date.now() + 5 * 24 * 3600000,
    currency: 'LYD',
    status: 'active',
    createdAt: Date.now() - 60 * 24 * 3600000,
    notes: 'عربون مجمد من الحساب'
  },
  {
    id: 'i2',
    purchaseId: 'PUR-2025-002',
    productName: 'هاتف iPhone 15 Pro',
    totalAmount: 3500,
    downPayment: 700,
    downPaymentFrozen: true,
    remainingAmount: 2800,
    installmentAmount: 400,
    paidInstallments: 4,
    totalInstallments: 7,
    nextDueDate: Date.now() + 12 * 24 * 3600000,
    currency: 'USD',
    status: 'active',
    createdAt: Date.now() - 120 * 24 * 3600000
  },
  {
    id: 'i3',
    purchaseId: 'PUR-2025-003',
    productName: 'تلفزيون Samsung 65"',
    totalAmount: 2500,
    downPayment: 500,
    downPaymentFrozen: false,
    remainingAmount: 0,
    installmentAmount: 400,
    paidInstallments: 5,
    totalInstallments: 5,
    nextDueDate: Date.now() - 10 * 24 * 3600000,
    currency: 'LYD',
    status: 'completed',
    createdAt: Date.now() - 150 * 24 * 3600000,
    notes: 'مكتمل بنجاح'
  },
  {
    id: 'i4',
    purchaseId: 'PUR-2025-004',
    productName: 'كاميرا Canon EOS R5',
    totalAmount: 8000,
    downPayment: 2000,
    downPaymentFrozen: true,
    remainingAmount: 6000,
    installmentAmount: 1000,
    paidInstallments: 0,
    totalInstallments: 6,
    nextDueDate: Date.now() + 15 * 24 * 3600000,
    currency: 'USD',
    status: 'frozen',
    createdAt: Date.now() - 10 * 24 * 3600000,
    notes: 'بانتظار تأكيد البائع'
  },
]);

// ═══════════════════════════════════════════════
// Computed - Options
// ═══════════════════════════════════════════════

/**
 * Currency options for filters
 */
const currencyOptions = computed(() => wallets.value.map(w => w.code));

// ═══════════════════════════════════════════════
// Computed - Filtered Transactions
// ═══════════════════════════════════════════════

/**
 * Filtered transactions based on search and filters
 */
const filteredTx = computed(() => {
  const q = search.value.trim().toLowerCase();
  return allTx.value.filter(t => {
    if (currencyFilter.value && t.currency !== currencyFilter.value) return false;
    if (typeFilter.value.length && !typeFilter.value.includes(t.type)) return false;
    if (q && !(`${t.description} ${t.counterparty ?? ''}`.toLowerCase().includes(q))) return false;
    return true;
  });
});

// ═══════════════════════════════════════════════
// State - Pagination
// ═══════════════════════════════════════════════

/**
 * Current page number
 */
const page = ref(1);

/**
 * Items per page
 */
const pageSize = ref(10);

/**
 * Total number of pages
 */
const pages = computed(() => Math.max(1, Math.ceil(filteredTx.value.length / pageSize.value)));

/**
 * Paginated transactions for current page
 */
const pagedTx = computed(() => {
  const start = (page.value - 1) * pageSize.value;
  return filteredTx.value
    .slice()
    .sort((a, b) => b.date - a.date)
    .slice(start, start + pageSize.value);
});

/**
 * Total amount for current page
 */
const pageTotal = computed(() => pagedTx.value.reduce((s, t) => s + t.amount, 0));

// ═══════════════════════════════════════════════
// Computed - Filtered Salaries
// ═══════════════════════════════════════════════

/**
 * Filtered salaries based on search and filters
 */
const filteredSalaries = computed(() => {
  const q = search.value.trim().toLowerCase();
  return allSalaries.value.filter(s => {
    if (currencyFilter.value && s.currency !== currencyFilter.value) return false;
    if (q && !(`${s.employer} ${s.month} ${s.notes ?? ''}`.toLowerCase().includes(q))) return false;
    return true;
  });
});

// ═══════════════════════════════════════════════
// State - Salary Pagination
// ═══════════════════════════════════════════════

/**
 * Current page number for salaries
 */
const salaryPage = ref(1);

/**
 * Total number of pages for salaries
 */
const salaryPages = computed(() => Math.max(1, Math.ceil(filteredSalaries.value.length / pageSize.value)));

/**
 * Paginated salaries for current page
 */
const pagedSalaries = computed(() => {
  const start = (salaryPage.value - 1) * pageSize.value;
  return filteredSalaries.value
    .slice()
    .sort((a, b) => b.date - a.date)
    .slice(start, start + pageSize.value);
});

/**
 * Total amount for current salary page
 */
const salaryPageTotal = computed(() => pagedSalaries.value.reduce((s, t) => s + t.amount, 0));

// ═══════════════════════════════════════════════
// Computed - Filtered Transfers
// ═══════════════════════════════════════════════

/**
 * Filtered transfers based on search and filters
 */
const filteredTransfers = computed(() => {
  const q = search.value.trim().toLowerCase();
  return allTransfers.value.filter(t => {
    if (currencyFilter.value && t.currency !== currencyFilter.value) return false;
    if (q && !(`${t.from} ${t.to} ${t.reference ?? ''} ${t.notes ?? ''}`.toLowerCase().includes(q))) return false;
    return true;
  });
});

// ═══════════════════════════════════════════════
// State - Transfer Pagination
// ═══════════════════════════════════════════════

/**
 * Current page number for transfers
 */
const transferPage = ref(1);

/**
 * Total number of pages for transfers
 */
const transferPages = computed(() => Math.max(1, Math.ceil(filteredTransfers.value.length / pageSize.value)));

/**
 * Paginated transfers for current page
 */
const pagedTransfers = computed(() => {
  const start = (transferPage.value - 1) * pageSize.value;
  return filteredTransfers.value
    .slice()
    .sort((a, b) => b.date - a.date)
    .slice(start, start + pageSize.value);
});

/**
 * Total amount for current transfer page
 */
const transferPageTotal = computed(() => pagedTransfers.value.reduce((s, t) => s + t.amount, 0));

// ═══════════════════════════════════════════════
// Computed - Filtered Installments
// ═══════════════════════════════════════════════

/**
 * Filtered installments based on search and filters
 */
const filteredInstallments = computed(() => {
  const q = search.value.trim().toLowerCase();
  return allInstallments.value.filter(i => {
    if (currencyFilter.value && i.currency !== currencyFilter.value) return false;
    if (q && !(`${i.productName} ${i.purchaseId} ${i.notes ?? ''}`.toLowerCase().includes(q))) return false;
    return true;
  });
});

// ═══════════════════════════════════════════════
// State - Installment Pagination
// ═══════════════════════════════════════════════

/**
 * Current page number for installments
 */
const installmentPage = ref(1);

/**
 * Total number of pages for installments
 */
const installmentPages = computed(() => Math.max(1, Math.ceil(filteredInstallments.value.length / pageSize.value)));

/**
 * Paginated installments for current page
 */
const pagedInstallments = computed(() => {
  const start = (installmentPage.value - 1) * pageSize.value;
  return filteredInstallments.value
    .slice()
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(start, start + pageSize.value);
});

/**
 * Total remaining amount for current installment page
 */
const installmentPageTotal = computed(() => pagedInstallments.value.reduce((s, i) => s + i.remainingAmount, 0));

// ═══════════════════════════════════════════════
// Table Configuration
// ═══════════════════════════════════════════════

/**
 * Table headers configuration
 */
const headers = [
  { title: 'التاريخ', key: 'date', sortable: true },
  { title: 'النوع', key: 'type', sortable: true },
  { title: 'العملة', key: 'currency', sortable: true },
  { title: 'المبلغ', key: 'amount', sortable: true, align: 'end' as const },
  { title: 'الحالة', key: 'status', sortable: true },
  { title: 'الوصف', key: 'description', sortable: false, width: 320 },
];

/**
 * Salary table headers configuration
 */
const salaryHeaders = [
  { title: 'التاريخ', key: 'date', sortable: true },
  { title: 'جهة العمل', key: 'employer', sortable: true, width: 280 },
  { title: 'الشهر', key: 'month', sortable: true },
  { title: 'السنة', key: 'year', sortable: true },
  { title: 'العملة', key: 'currency', sortable: true },
  { title: 'المبلغ', key: 'amount', sortable: true, align: 'end' as const },
  { title: 'الحالة', key: 'status', sortable: true },
  { title: 'ملاحظات', key: 'notes', sortable: false, width: 200 },
];

/**
 * Transfer table headers configuration
 */
const transferHeaders = [
  { title: 'التاريخ', key: 'date', sortable: true },
  { title: 'من', key: 'from', sortable: true, width: 200 },
  { title: 'إلى', key: 'to', sortable: true, width: 200 },
  { title: 'المرجع', key: 'reference', sortable: true },
  { title: 'العملة', key: 'currency', sortable: true },
  { title: 'المبلغ', key: 'amount', sortable: true, align: 'end' as const },
  { title: 'الحالة', key: 'status', sortable: true },
  { title: 'ملاحظات', key: 'notes', sortable: false, width: 180 },
];

/**
 * Installment table headers configuration
 */
const installmentHeaders = [
  { title: 'المنتج', key: 'productName', sortable: true, width: 220 },
  { title: 'رقم الطلب', key: 'purchaseId', sortable: true },
  { title: 'الإجمالي', key: 'totalAmount', sortable: true, align: 'end' as const },
  { title: 'العربون', key: 'downPayment', sortable: true, align: 'end' as const },
  { title: 'المتبقي', key: 'remainingAmount', sortable: true, align: 'end' as const },
  { title: 'القسط', key: 'installmentAmount', sortable: true, align: 'end' as const },
  { title: 'التقدم', key: 'progress', sortable: false },
  { title: 'الاستحقاق', key: 'nextDueDate', sortable: true },
  { title: 'الحالة', key: 'status', sortable: true },
];

// ═══════════════════════════════════════════════
// Formatting Functions
// ═══════════════════════════════════════════════

/**
 * Format number as currency
 */
function fmt(n: number, ccy: string) {
  return new Intl.NumberFormat(locale.value, {
    style: 'currency',
    currency: ccy,
    maximumFractionDigits: 2
  }).format(n);
}

/**
 * Get display name for currency code
 */
function currencyDisplayName(code: string) {
  try {
    // @ts-ignore - Intl.DisplayNames may not be available on all browsers
    const dn = new Intl.DisplayNames([locale.value], { type: 'currency' });
    return dn.of(code) || code;
  } catch {
    return displayLang.value === 'ar' ? namesAR[code] ?? code : namesEN[code] ?? code;
  }
}

/**
 * Currency names in Arabic
 */
const namesAR: Record<string, string> = {
  LYD: 'الدينار الليبي',
  USD: 'الدولار الأمريكي',
  EUR: 'اليورو',
  GBP: 'الجنيه الإسترليني'
};

/**
 * Currency names in English
 */
const namesEN: Record<string, string> = {
  LYD: 'Libyan Dinar',
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound'
};

/**
 * Format timestamp as localized date
 */
function formatDate(ts: number) {
  return new Date(ts).toLocaleString(locale.value, {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
}

/**
 * Format timestamp as relative time
 */
function formatRelative(ts: number) {
  const diff = Date.now() - ts;
  const mins = Math.round(diff / 60000);
  
  if (mins < 1) return 'الآن';
  if (mins < 60) return `${mins} د`;
  
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} س`;
  
  const days = Math.round(hrs / 24);
  return `${days} يوم`;
}

// ═══════════════════════════════════════════════
// Helper Functions
// ═══════════════════════════════════════════════

/**
 * Get CSS class for amount (positive/negative)
 */
function amountClass(t: Tx) {
  return t.amount < 0 ? 'neg' : 'pos';
}

/**
 * Get color for transaction type
 */
function typeColor(t: TxType) {
  return t === 'deposit' ? 'success' : t === 'withdrawal' ? 'error' : t === 'transfer' ? 'primary' : 'purple';
}

/**
 * Get color for transaction status
 */
function statusColor(s: TxStatus) {
  return s === 'completed' ? 'green' : s === 'pending' ? 'amber' : 'red';
}

/**
 * Get Arabic label for transaction type
 */
function typeLabel(t: TxType) {
  return t === 'deposit' ? 'إيداع' : t === 'withdrawal' ? 'سحب' : t === 'transfer' ? 'حوالة' : 'دفع';
}

/**
 * Get Arabic label for transaction status
 */
function statusLabel(s: TxStatus) {
  return s === 'completed' ? 'مكتملة' : s === 'pending' ? 'قيد التنفيذ' : 'فاشلة';
}

/**
 * Get color for installment status
 */
function installmentStatusColor(s: Installment['status']) {
  return s === 'active' ? 'success' : s === 'completed' ? 'primary' : s === 'frozen' ? 'orange' : 'error';
}

/**
 * Get Arabic label for installment status
 */
function installmentStatusLabel(s: Installment['status']) {
  return s === 'active' ? 'نشط' : s === 'completed' ? 'مكتمل' : s === 'frozen' ? 'مجمد' : 'متعثر';
}

/**
 * Calculate installment progress percentage
 */
function installmentProgress(i: Installment) {
  return Math.round((i.paidInstallments / i.totalInstallments) * 100);
}

/**
 * Format days until due
 */
function daysUntilDue(dueDate: number) {
  const diff = dueDate - Date.now();
  const days = Math.ceil(diff / (24 * 3600000));
  if (days < 0) return `متأخر ${Math.abs(days)} يوم`;
  if (days === 0) return 'اليوم';
  if (days === 1) return 'غدًا';
  return `بعد ${days} يوم`;
}

// ═══════════════════════════════════════════════
// State - Dialogs
// ═══════════════════════════════════════════════

/**
 * Deposit dialog state
 */
const depositOpen = ref(false);

/**
 * Withdraw dialog state
 */
const withdrawOpen = ref(false);

/**
 * Transfer dialog state
 */
const transferOpen = ref(false);

/**
 * Form data for all operations
 */
const form = ref<{
  amount: number | null;
  currency: string | null;
  to?: string;
  note?: string;
}>({
  amount: null,
  currency: null,
  to: '',
  note: ''
});

// ═══════════════════════════════════════════════
// Dialog Actions
// ═══════════════════════════════════════════════

/**
 * Open deposit dialog
 */
function openDeposit(w?: Wallet) {
  depositOpen.value = true;
  form.value.currency = w?.code ?? wallets.value[activeIndex.value]?.code ?? null;
}

/**
 * Open withdraw dialog
 */
function openWithdraw(w?: Wallet) {
  withdrawOpen.value = true;
  form.value.currency = w?.code ?? wallets.value[activeIndex.value]?.code ?? null;
}

/**
 * Open transfer dialog
 */
function openTransfer(w?: Wallet) {
  transferOpen.value = true;
  form.value.currency = w?.code ?? wallets.value[activeIndex.value]?.code ?? null;
}

/**
 * Submit transaction
 */
function submit(kind: TxType) {
  if (!form.value.amount || !form.value.currency) return;
  
  const amt = kind === 'withdrawal' || kind === 'payment' || (kind === 'transfer' && form.value.to)
    ? -Math.abs(form.value.amount)
    : Math.abs(form.value.amount);
  
  allTx.value.unshift({
    id: Math.random().toString(36).slice(2),
    date: Date.now(),
    type: kind,
    status: 'completed',
    currency: form.value.currency,
    amount: amt,
    description: form.value.note || (
      kind === 'deposit' ? 'إيداع' :
      kind === 'withdrawal' ? 'سحب' :
      kind === 'transfer' ? `حوالة إلى ${form.value.to ?? ''}` :
      'دفع'
    )
  });
  
  // Update active wallet balance
  const w = wallets.value.find(x => x.code === form.value.currency);
  if (w) {
    w.balance += amt;
    w.updatedAt = Date.now();
  }
  
  depositOpen.value = withdrawOpen.value = transferOpen.value = false;
  form.value = { amount: null, currency: null, to: '', note: '' };
}

/**
 * Reset all filters
 */
function resetFilters() {
  search.value = '';
  currencyFilter.value = null;
  typeFilter.value = [];
}
</script>

<style scoped>
/* ═══════════════════════════════════════════════
   Main Container
   ═══════════════════════════════════════════════ */

.wallet-page {
  direction: rtl;
}

/* ═══════════════════════════════════════════════
   Cards & Gradients
   ═══════════════════════════════════════════════ */

.gradient-card {
  background: linear-gradient(135deg, #ffffff, #f7f9ff);
}

/* ═══════════════════════════════════════════════
   Wallet Carousel
   ═══════════════════════════════════════════════ */

.wallet-carousel {
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 8px;
  align-items: center;
}

.nav-btn {
  width: 44px;
  height: 44px;
}

/* ═══════════════════════════════════════════════
   Wallet Cards - Theme Styles
   ═══════════════════════════════════════════════ */

.wallet-card {
  background: radial-gradient(1200px 360px at 10% 0%, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.6)), var(--bg);
  border: 1px solid rgba(255, 255, 255, 0.5);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.wallet-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
}

.wallet-card.theme-blue {
  --bg: linear-gradient(135deg, #e3f2fd, #bbdefb);
}

.wallet-card.theme-green {
  --bg: linear-gradient(135deg, #e8f5e9, #c8e6c9);
}

.wallet-card.theme-purple {
  --bg: linear-gradient(135deg, #f3e5f5, #e1bee7);
}

.wallet-card.theme-amber {
  --bg: linear-gradient(135deg, #fff8e1, #ffecb3);
}

.wallet-body {
  padding: 18px;
}

/* ═══════════════════════════════════════════════
   Transaction Table
   ═══════════════════════════════════════════════ */

.wallet-table :deep(thead th) {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.08), rgba(var(--v-theme-primary), 0.03));
  font-weight: 700;
  font-size: 0.875rem;
  color: rgb(var(--v-theme-primary));
  border-bottom: 2px solid rgba(var(--v-theme-primary), 0.15);
}

.wallet-table :deep(tbody tr:hover) {
  background: linear-gradient(90deg, rgba(var(--v-theme-primary), 0.04), transparent);
}

/* ═══════════════════════════════════════════════
   Amount Colors
   ═══════════════════════════════════════════════ */

.pos {
  color: #2e7d32;
  font-weight: 600;
}

.neg {
  color: #c62828;
  font-weight: 600;
}

/* ═══════════════════════════════════════════════
   Responsive Design
   ═══════════════════════════════════════════════ */

@media (max-width: 960px) {
  .wallet-body {
    padding: 16px;
  }
}

@media (max-width: 600px) {
  .wallet-card .text-h6 {
    font-size: 1.125rem !important;
  }

  .wallet-card .text-h4 {
    font-size: 1.5rem !important;
  }
}
</style>

<!--
USAGE
- احفظ الملف باسم: pages/wallet.vue
- افتح: /wallet
- يعتمد على Vuetify 3 (v-window للسلايدر, v-slide-group للتنقل السريع, v-data-table للجدول)
- استبدل بيانات wallets/allTx بنداءات API حقيقية
- أفضل الممارسات:
  * Intl.NumberFormat لعرض العملات حسب اللغة/المنطقة
  * v-window + v-slide-group للتبديل السلس بين المحافظ
  * v-data-table مع pagination وفرز ثابت
  * RTL مُفعل وتصميم بسيط ونظيف
-->
