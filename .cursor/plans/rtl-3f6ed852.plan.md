<!-- 3f6ed852-b9cc-446b-911a-787e89238bd8 0332cda3-7dbe-487e-a740-14d83bd47b59 -->
# RTL + i18n consolidation for full Arabic support

## Scope

- Fix RTL spacing and icons in breadcrumbs (home icon margin, divider direction)
- Remove header RTL auto-margins and rely on flex + logical spacing
- Standardize page meta to use i18n keys across `app/pages/*`
- Correct i18n `langDir` path and ensure messages load reliably (SSR/CSR)
- Add any missing i18n keys for route segments used in breadcrumbs

## Targeted edits

1) nuxt.config.ts

- Correct `langDir` to project-root path.
```diff
-    langDir: '../app/i18n/locales',
+    langDir: 'app/i18n/locales',
```


2) app/layouts/dashboard.vue (breadcrumbs)

- Use logical margin on the home icon and a directional divider icon.
```diff
-  <v-icon size="16" class="mr-2">mdi-home</v-icon>
+  <v-icon size="16" class="me-2">mdi-home</v-icon>
```

- Add in <script setup>:
```ts
const { getDirectionalIcon } = useRTL()
const chevronDivider = getDirectionalIcon('mdi-chevron-right', 'mdi-chevron-left')
```

- Replace divider slot:
```diff
-  <v-icon size="14">mdi-chevron-right</v-icon>
+  <v-icon size="14">{{ chevronDivider }}</v-icon>
```


3) app/components/AppHeader.vue (header spacing)

- Reduce center block margin and remove RTL auto-margins from CSS utilities.
```diff
- <div class="header-center flex-grow-1 mx-8" style="max-width: 500px;">
+ <div class="header-center flex-grow-1 mx-4" style="max-width: 500px;">
```


4) app/assets/css/rtl-utilities.css (remove forced header margins)

- Delete RTL overrides that push huge gaps:
```diff
-[dir="rtl"] .header-right { margin-left: auto; margin-right: 0; }
-[dir="rtl"] .header-left  { margin-right: auto; margin-left: 0; }
```


5) app/pages/* (standardize meta to i18n keys)

- For each page, set:
```ts
definePageMeta({
  layout: 'dashboard',
  title: 'pages.<route>.title',
  subtitle: 'pages.<route>.subtitle'
})
```

- Example (`app/pages/movies.vue`):
```diff
- definePageMeta({ layout: 'dashboard', title: 'Movies' })
+ definePageMeta({ layout: 'dashboard', title: 'pages.movies.title', subtitle: 'pages.movies.subtitle' })
```

- Apply similarly to: `index.vue (pages.overview.*)`, `analytics/*`, `customers.vue`, `cards.vue`, `inbox.vue`, `chat.vue`, `settings.vue`, `support.vue`, `profile.vue`, `transactions/*`, `wallets/*`, `orders/*`, `pagination-test.vue`, `language-test.vue`, `loading-test.vue`, `columns.vue`, `charts.vue`, `users.vue`, `wallets-new.vue`, `newCharts.vue`.

6) app/i18n/locales/en.json & ar.json (ensure missing keys)

- Add any missing keys referenced above (only if absent), e.g.:
```json
"navigation": {
  "orders": "Orders",
  "all-checks": "All Checks"
}
```
```json
"navigation": {
  "orders": "الطلبات",
  "all-checks": "كل الشيكات"
}
```

- Add `pages.*.title/subtitle` pairs for pages that don’t already exist (e.g., `pagination-test`, `language-test`, `loading-test`, `wallets-new`, `columns`, `newCharts`).

## Verification

- Switch locale en↔ar; verify:
  - Header has no excessive left gap in Arabic
  - Breadcrumbs: home icon spacing correct; divider direction flips
  - All page titles/subtitles and breadcrumbs are translated
  - No RTL/LTR flicker on refresh (SSR)

## Rollback safety

- All changes are small, localized, and reversible.

### To-dos

- [x] Correct i18n langDir path in nuxt.config.ts to app/i18n/locales
- [ ] Make breadcrumbs RTL-safe: logical spacing + directional divider
- [ ] Remove header RTL auto-margins; reduce header-center margin
- [ ] Standardize definePageMeta to pages.* i18n keys across app/pages/*
- [ ] Add missing navigation/pages keys in en/ar JSON used by breadcrumbs/meta
- [ ] Manual verify en/ar: header, breadcrumbs, titles, SSR refresh