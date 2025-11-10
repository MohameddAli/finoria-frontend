<!-- Copilot instructions for working inside the Finoria Nuxt4 frontend repo -->
# Copilot / AI Agent Quick Orientation

This file contains targeted, actionable guidance for AI coding agents working on this repository. Focus on concrete, discoverable patterns and files so you can be productive immediately.

1) Big picture
- Framework: Nuxt 4 (frontend-only). Source lives under `app/`.
- UI: Vuetify 3 (theme definitions in `app/theme.ts` and theme collection under `app/theme/*`/`app/theme/themes`).
- State: Pinia 3; stores are placed under `app/stores` and follow `storeXxx.ts` inside feature subfolders (e.g. `app/stores/users/storeUsers.ts`).
- Patterns: Composition API with `<script setup lang="ts">` and composables named `useXxx` in `app/composables/`.

2) Primary integration & flows
- Auth flow: `app/middleware/auth.global.ts` guards pages with `meta.layout === 'dashboard'`. It relies on `localStorage` keys `auth_token` and `auth_user` and stores a `auth_redirect_url` for post-login redirect.
- UI theme: `app/plugins/vuetify.ts` wires Vuetify. Themes are named `${theme}-${mode}`. `allowedThemes` and `allowedModes` are validated here — update both when adding themes.
- i18n: Config at `app/i18n.config.ts` (default `ar`, fallback `en`). Locale files live under `i18n/locales` or `app/i18n`.
- Notifications: centralized toast API at `app/composables/useToast.ts` and state at `app/composables/useToastState.ts`. Prefer `useToast()` for UI messages; `useSnackbar()` is provided as deprecated compatibility.
- Errors: `app/composables/useErrorHandler.ts` is the unified error handling layer — use `handleApiError` / `handleErrorWithRetry` for API calls.

3) Conventions and hard rules (do not contradict)
- Use TypeScript `strict` and Composition API; files should use `<script setup lang="ts">`.
- Prefer interfaces over `type` for objects that will be extended/merged.
- Do not use `class` for component logic; use composables and Pinia actions.
- Avoid `enum`; use `as const` maps/objects for lookup tables.
- Composables: file names `useXxx.ts`; exports are functions returning the API object (e.g., `useToast()`).
- Stores: folder per feature, file named `storeXxx.ts` and use Pinia setup stores (`defineStore`).

4) Developer workflows (commands & environment)
- Install: this repo uses pnpm in CI (lockfile `pnpm-lock.yaml`) — prefer `pnpm install`. npm/yarn will also work but we prefer `pnpm`.
  - Windows PowerShell example:
    ```powershell
    pnpm install
    pnpm dev    # runs `nuxt dev`
    pnpm build  # runs `nuxt build`
    pnpm preview
    ```
- Nuxt scripts live in `package.json` (`dev`, `build`, `generate`, `preview`). Run these from repository root.
- Lint / formatting: ESLint is configured via `@nuxt/eslint`. Run `pnpm lint` only if project adds script; otherwise run `npx eslint .`.

5) Files to consult for context (examples used in generated changes)
- `app/plugins/vuetify.ts` — theme wiring, allowedThemes/allowedModes, events `theme-change` and `theme-mode-change`.
- `app/theme.ts` and `app/theme/themes` — canonical theme color definitions.
- `app/middleware/auth.global.ts` — global auth guard (how protected routes are detected and redirected).
- `app/composables/useErrorHandler.ts` — canonical error classification and messaging.
- `app/composables/useToast.ts` & `app/composables/useToastState.ts` — toast API and state shape.
- `app/i18n.config.ts` and `i18n/locales/` — locale defaults and where translations are stored.

6) Common edits pattern / examples
- Adding a new store: create `app/stores/<feature>/store<Feature>.ts`, use `defineStore('feature', () => { ... })` and export typed actions. Register nothing else — Pinia is auto-available through `@pinia/nuxt`.
- Adding translations: add the file under `i18n/locales/{en,ar}.json` and run the translation key checker (see TODOs). Ensure keys used in components match `i18n` keys; missing keys show console warnings.
- Changing themes: update `app/theme/*` and `app/plugins/vuetify.ts` (`allowedThemes`), then emit `window.dispatchEvent(new CustomEvent('theme-change', { detail: 'yourTheme' }))` on client-side runtime.

7) Safety & scoping guidance for automated edits
- Prefer minimal, local changes: update or add files under `app/` or `shared/` only when necessary.
- Do not change server-side concerns (there is no `server/` folder in this repo) — this is frontend-only.
- When altering auth flow, preserve `localStorage` keys `auth_token` and `auth_user` or update all usages consistently (middleware + stores + login component).
- When editing i18n keys, update both `ar` and `en` locales; keep `app/i18n.config.ts` fallback in mind.

8) PR checklist for AI-generated changes
- Run `pnpm dev` to ensure no runtime errors for client-only changes.
- Fix any Vue warnings like "property X was accessed during render but is not defined" before opening PR.
- If touching themes, validate theme names in `app/plugins/vuetify.ts` and confirm runtime dispatch event wiring.
- If adding UI copy or keys, update both locale files and confirm no missing-key console warnings.

9) Where to look for tests / missing items
- This repo currently has no unit or e2e tests. If adding tests, prefer `vitest` + `@vue/test-utils` and place tests under `tests/`.

10) If uncertain, follow these fallback rules
- Keep changes small and reversible (single feature per PR).
- Reference and mirror patterns in `app/composables/*` and `app/stores/*` rather than inventing new global patterns.

-- End of guidance --

If you'd like, I can merge this file into the repository now or expand any section (examples for store skeleton, i18n linter script, or PR templates). Please tell me which section to expand. 
