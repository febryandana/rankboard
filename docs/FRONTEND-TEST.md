# RankBoard Frontend Testing Guide

This document describes the complete frontend testing strategy for RankBoard, including tooling, conventions, test plans, and the latest execution results.

---

## 1. Overview

| Item                     | Details                                                                                                                              |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| Test Runner              | [Vitest](https://vitest.dev/)                                                                                                        |
| UI Helpers               | [React Testing Library](https://testing-library.com/) with custom provider wrapper                                                   |
| Assertion Helpers        | `@testing-library/jest-dom/vitest`                                                                                                   |
| Component Coverage Focus | Authentication, API client service, and high-value UI flows                                                                          |
| Location                 | All tests live beside their source files (`*.test.tsx/ts`)                                                                           |
| Setup File               | [`src/test/setup.ts`](src/test/setup.ts)                                                                                             |
| Custom Render Helpers    | [`src/test/test-utils.tsx`](src/test/test-utils.tsx)                                                                                 |
| Command                  | `npm run test` (watch) or `npm run test -- --runInBand` (not supported) / `npm run test -- --runTestsByPath` for selective execution |
| Coverage                 | `npm run test:coverage` (uses `@vitest/coverage-v8`)                                                                                 |

---

## 2. Tooling Configuration

### 2.1 Vitest Configuration (Implicit via Vite)

- Vitest automatically picks up configuration from Vite + `tsconfig`.
- `package.json` scripts provide:
  - `npm run test` – default watch mode (used during development).
  - `npm run test:coverage` – one-off coverage with V8 provider.
  - `npm run test:ui` – interactive browser test runner if needed.

### 2.2 Global Test Setup [`src/test/setup.ts`](src/test/setup.ts)

Key responsibilities:

1. **React Testing Library cleanup** – automatically unmounts between specs.
2. **DOM API polyfills** – `matchMedia`, `IntersectionObserver`, `ResizeObserver`.
3. **`jest-dom` matchers** – extends Vitest assertions for DOM semantics.

### 2.3 Custom Render Helper [`src/test/test-utils.tsx`](src/test/test-utils.tsx)

- Wraps `render` with `BrowserRouter`, `ThemeProvider`, and `AuthProvider`.
- Ensures every component test has access to routing, theme, and auth context by default.
- Re-exports `@testing-library/react` helpers to reduce import noise.

---

## 3. Current Test Suites

| Area               | Location                                                                           | Description                                                                                                                                                                                                                                                |
| ------------------ | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Auth UI            | [`src/components/auth/LoginForm.test.tsx`](src/components/auth/LoginForm.test.tsx) | Ensures login form renders, handles input, toggles password visibility, displays loading/error states, and interacts with navigation + `useAuth`. Uses spies/mocks on context and `useNavigate`.                                                           |
| API Client Service | [`src/lib/api.test.ts`](src/lib/api.test.ts)                                       | Validates axios client configuration, retry strategy, response interceptor behavior, and ensures high-level service methods (auth/users/challenges/submissions/scores) invoke HTTP client with correct payloads/settings. Also asserts 401 redirect logic. |

---

## 4. Test Plan & Scenarios

### 4.1 Authentication UI (`LoginForm`)

| Scenario                                                            | Coverage |
| ------------------------------------------------------------------- | -------- |
| Form renders logo, tagline, username/password fields, submit button | ✅       |
| Controlled inputs capture username & password                       | ✅       |
| Password visibility toggle switching between `password` and `text`  | ✅       |
| Form submission calls `useAuth().login` and redirects to dashboard  | ✅       |
| Error handling path surfaces backend message in UI                  | ✅       |
| Submit button enters loading state and disables during async login  | ✅       |

### 4.2 API Client Service (`lib/api`)

| Scenario                                                                                        | Coverage |
| ----------------------------------------------------------------------------------------------- | -------- |
| Axios instance created with `baseURL`, JSON headers, cookies enabled                            | ✅       |
| `axios-retry` wired with exponential delay, 3 retries, network/5xx detection                    | ✅       |
| Auth `login/logout/getSession` routes hit correct endpoints                                     | ✅       |
| Users API: `getAll`, `getById`, `create`, `update`, `delete`, `uploadAvatar`, `deleteAvatar`    | ✅       |
| Challenges API: `getAll`, `getById`, `create`, `update`, `delete`                               | ✅       |
| Submissions API: list, create, update, download (ensures `FormData` and `responseType: 'blob'`) | ✅       |
| Scores API: fetch leaderboard, create/update score, fetch personal scores                       | ✅       |
| Response interceptor redirects to `/login` only for non-session 401 responses                   | ✅       |

Mocking approach:

- Axios client is mocked to assert configuration and method calls.
- `axios-retry` stubbed to capture configuration parameters.
- `window.location` stubbed to observe redirects without touching real browser location.

---

## 5. Running Tests

### 5.1 Pre-requisites

- Install dependencies inside `frontend`: `npm install`.
- Ensure `.env` values (especially `VITE_API_URL`) are set if required by tests. For the mocked suite, no live backend is necessary.

### 5.2 Commands

```bash
# From /frontend
npm run test
```

- Vitest defaults to watch mode. Press `q` to exit when done.
- To run a single file: `npx vitest run src/lib/api.test.ts`.
- Coverage: `npm run test:coverage`.

### 5.3 Notes

- `--runInBand` flag is a Jest option and **not supported** by Vitest (use default parallel mode or `vitest run` for CI).
- Warnings from React Router about future flags are harmless; they stem from simulated navigation within tests.

---

## 6. Latest Execution Log (2025-11-23)

```bash
> npm run test

 DEV  v4.0.13 /frontend
 ✓ src/lib/api.test.ts (7 tests)
 ✓ src/components/auth/LoginForm.test.tsx (6 tests)

 Test Files  2 passed
 Tests      13 passed
 Duration   ~0.9s
```

Observations:

- `Retry attempt 1 for /auth/session` logs originate from the API module’s retry handler invoked via mocked requests. This is expected behavior confirming the retry pipeline.
- React Router printed future-flag warnings; no action required presently.

---

## 7. Future Work

1. **Add Coverage for Context Providers**
   - AuthContext and ThemeContext behaviors (session bootstrapping, theme persistence, media query handling).

2. **Test Hooks & Utilities**
   - `useChallenges`, `useTheme`, `useAuth` hook wrappers.
   - Utility helpers in [`src/lib/utils.ts`](src/lib/utils.ts) for formatting and URL helpers.

3. **Critical Page Flows**
   - Integration tests for Landing, Home, and Challenge pages using MSW to mock API responses.

4. **Visual Regression / Storybook Testing (Optional)**
   - Consider Storybook with interaction tests for complex components (e.g., admin scoring table).

---

## 8. Troubleshooting

| Issue                                        | Resolution                                                                                   |
| -------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `CACError: Unknown option '--runInBand'`     | Remove unsupported flag. Use `npm run test` directly or `npx vitest run` for non-watch runs. |
| `Retry attempt 1 for /auth/session` log spam | Expected due to axios-retry mocks. Confirm no real network calls are happening.              |
| React Router future flag warnings            | Optional: enable future flags via Router configuration to silence warnings in tests.         |

---

## 9. Reference Files

- [`src/lib/api.ts`](src/lib/api.ts:1) – API client implementation under test.
- [`src/lib/api.test.ts`](src/lib/api.test.ts:1) – Service test suite (created via current work).
- [`src/components/auth/LoginForm.tsx`](src/components/auth/LoginForm.tsx:1) – Component under test.
- [`src/components/auth/LoginForm.test.tsx`](src/components/auth/LoginForm.test.tsx:1) – Component test suite.
- [`src/test/setup.ts`](src/test/setup.ts:1) – Global setup.
- [`src/test/test-utils.tsx`](src/test/test-utils.tsx:1) – Custom render helper.

---

Maintaining this document:

- Update “Latest Execution Log” after each meaningful test run.
- Record new suites and coverage notes in Sections 3–5.
- Capture troubleshooting steps for recurring issues.
