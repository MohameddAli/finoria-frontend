<!-- d8a5c4a6-8665-4656-b1d4-67f47ac237f3 1125c2a3-9814-425d-836b-d59ebc4b2512 -->
# Nuxt 4 HTTP client (axios-like) — clean & minimal

### Overview

Build an axios-like HTTP layer with ofetch and Nuxt conventions: one tiny plugin exposes `$api`, a slim `useApi` composable for typed calls and SSR-friendly `useFetch`, centralized error/i18n handling, optional GET retries, and integrated loading. No duplication, minimal code, idiomatic Nuxt 4.

### Analysis of your Vue 2 `plugins/axios.js`

- **What it does well**: baseURL, token header, toast-based error UX, 401 redirect with return-to, simple backoff retry on network errors.
- **Gaps vs Nuxt 4 best practices**: not SSR-safe (localStorage only), hard-coded baseURL, duplicated error-to-UI mapping, global state side-effects inside interceptor, retries not limited to idempotent methods, no typing.

### Architecture decisions (Nuxt 4)

- **Transport**: use `ofetch.create` (Nuxt’s $fetch) instead of Axios; no extra dependency.
- **Single source of truth**: one `$api` instance (plugin) handles baseURL, credentials, token, interceptors, error pipeline, and optional GET retries.
- **Composables**: `useApi` provides tiny wrappers: `get` (SSR via `useFetch`), `post/put/patch/delete` via `$api`.
- **Auth**: read token on client from Pinia/cookie/localStorage; on server prefer cookies via `credentials: 'include'` (no header injection when SSR).
- **Errors**: map HTTP/network to i18n keys, delegate 401/403 navigation to a small `handleApiError` utility (no duplication).
- **Loading UX**: integrate `useLoadingStore` with `type: 'api'` in interceptors (coexists with your router loading plugin).
- **Retries**: small helper for GET network errors only (cap attempts + jitter backoff). Disabled by default, opt-in per call.
- **Config**: `runtimeConfig.public.apiBaseUrl` + `.env`—no hardcoding.

### File-level plan (minimal diffs)

- `nuxt.config.ts`: ensure `runtimeConfig.public.apiBaseUrl` is present (reads `NUXT_PUBLIC_API_BASE_URL`).
- `app/plugins/api.ts` (new): create ofetch instance with interceptors; inject as `$api`.
- `app/composables/useApi.ts`: refactor to use `$api` and collapse duplication; keep `useFetch` for GET/SSR; expose optional `{ retry: true }` flag for GET.
- `shared/utils/errorHandler.ts`: centralize status→i18n key mapping and 401/403 actions used by both `$api` and `useFetch`.
- `app/i18n/{en,ar}.json`: add `errors.network`, `errors.unauthorized`, `errors.forbidden`, `errors.server`, `errors.bad_request`, `errors.not_found`.

### Essential snippets (illustrative only)

// app/plugins/api.ts
export default defineNuxtPlugin((nuxtApp) => {
const config = useRuntimeConfig()
const loading = useLoadingStore(nuxtApp.$pinia)
const api = $fetch.create({
baseURL: config.public.apiBaseUrl,
credentials: 'include',
onRequest({ options }) {
if (process.client) {
const token = localStorage.getItem('auth_token')
if (token) (options.headers ||= {})['Authorization'] = `Bearer ${token}`
}
loading.startLoading({ id: 'api', type: 'api' })
},
onResponse() { loading.stopLoading('api') },
onResponseError({ response, error }) {
loading.stopLoading('api')
handleApiError(response ?? error) // shared util
}
})
return { provide: { api } }
})```ts
// app/composables/useApi.ts (shape)
export const useApi = () => {
const { $api } = useNuxtApp()
const config = useRuntimeConfig()
const get = <T>(endpoint: string, opts?: { server?: boolean; lazy?: boolean; retry?: boolean }) =>
useFetch<T>(endpoint, {
baseURL: config.public.apiBaseUrl,
server: opts?.server ?? true,
lazy: opts?.lazy ?? false,
onResponseError({ response }) { handleApiError(response) },
async onRequest({ options }) {
if (process.client) {
const token = localStorage.getItem('auth_token')
if (token) (options.headers ||= {})['Authorization'] = `Bearer ${token}`
}
}
})
const request = <T>(method: 'POST'|'PUT'|'PATCH'|'DELETE', endpoint: string, body?: any) =>
$api<T>(endpoint, { method, body })
return { get, post: <T>(e: string, b?: any) => request<T>('POST', e, b), put: <T>(e,b) => request<T>('PUT',e,b), patch: <T>(e,b)=>request<T>('PATCH',e,b), delete: <T>(e)=>request<T>('DELETE',e) }
}
```

### Implementation Todos

- setup-runtime-config: Define `runtimeConfig.public.apiBaseUrl` and `.env` key `NUXT_PUBLIC_API_BASE_URL`.
- api-plugin: Create `app/plugins/api.ts` with `$fetch.create`, interceptors, and `$api` injection. Depends: setup-runtime-config.
- error-i18n: Add error i18n keys/messages in `app/i18n/{en,ar}.json` and use them in `handleApiError`.
- useapi-refactor: Refactor `app/composables/useApi.ts` to use `$api`, keep SSR-friendly GET via `useFetch`, and remove duplicated try/catch. Depends: api-plugin, error-i18n.
- api-loading: Ensure API-level loading uses `useLoadingStore` in plugin (no duplication with router loader). Depends: api-plugin.
- retry-helper: Add a tiny GET-only retry helper with capped attempts + jitter; wire as opt-in flag in `get`. Depends: useapi-refactor.
- docs-update: Add a short usage section in `app/docs/README.md` covering `$api`, `useApi`, retries, and error semantics. Depends: all.

### To-dos

- [ ] Define runtimeConfig.public.apiBaseUrl and NUXT_PUBLIC_API_BASE_URL in .env
- [ ] Create app/plugins/api.ts with $fetch.create interceptors and provide $api
- [ ] Add error i18n keys in app/i18n/{en,ar}.json and use in handler
- [ ] Refactor app/composables/useApi.ts to use $api and slim API
- [ ] Integrate useLoadingStore start/stop in API plugin (type 'api')
- [ ] Add GET-only retry helper with capped attempts + jitter (opt-in)
- [ ] Document API layer usage and conventions in app/docs