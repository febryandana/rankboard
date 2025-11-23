# Backend Test Documentation

This document explains how the backend test suite is organized, the tooling that powers it, and the recent improvements made to the service-level unit tests. Use this guide as the single reference point for running, extending, and troubleshooting backend tests.

---

## 1. Test Stack Overview

| Layer                   | Tooling                                                        | Location                                                 |
| ----------------------- | -------------------------------------------------------------- | -------------------------------------------------------- |
| Test runner & assertion | Jest + ts-jest                                                 | [`jest.config.js`](backend/jest.config.js:1)             |
| Global setup            | Custom environment bootstrap                                   | [`src/test/setupEnv.ts`](backend/src/test/setupEnv.ts:1) |
| Unit tests              | Organized by feature (`controllers`, `services`, `middleware`) | `src/__tests__/**`                                       |
| Test doubles            | Jest mocks/stubs + custom helpers                              | Per test suite                                           |

The backend runs entirely on Node.js 18+ and TypeScript. Tests execute against the compiled TypeScript directly via `ts-jest`, avoiding manual builds.

---

## 2. Commands & Workflows

```bash
# Install backend dependencies
cd backend
npm install

# Execute all tests with coverage thresholds enforced
npm test

# Run a single suite (example: user service)
npx jest src/__tests__/services/userService.test.ts
```

Jest thresholds (branches/functions/lines/statements >= 70%) are enforced globally, as configured in [`jest.config.js`](backend/jest.config.js:1).

---

## 3. Global Test Environment

### 3.1 Environment Bootstrap

[`src/test/setupEnv.ts`](backend/src/test/setupEnv.ts:1) performs the following:

1. Forces `NODE_ENV=test` and seeds deterministic session/env secrets needed by controllers and middleware.
2. Extends the default Jest timeout to 10 seconds.
3. Clears mocks after each test (`jest.clearAllMocks()`), preventing state leakage.
4. Logs life-cycle hooks for traceability (`Starting test suite...` / `Test suite completed.`).

> **Note:** If a new suite requires additional global setup (e.g., polyfills), extend this file and re-run tests.

---

## 4. Jest Configuration Highlights

Key settings in [`jest.config.js`](backend/jest.config.js:1):

- `preset: 'ts-jest'` to transpile TS on the fly.
- `roots: ['<rootDir>/src']` constrains discovery to backend source.
- `testMatch` includes both `__tests__` folders and `*.test.ts` files.
- `setupFilesAfterEnv` points to the shared bootstrap file.
- `moduleNameMapper` supports `@/` aliases for ergonomics.

When adding new top-level folders, ensure they live under `src/` or update `roots/testMatch` accordingly.

---

## 5. Suite Topology & Responsibilities

| Suite       | File                                                                                                           | Focus                                                               |
| ----------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Controllers | [`src/__tests__/controllers/authController.test.ts`](backend/src/__tests__/controllers/authController.test.ts) | Authentication flow parity, HTTP contract validation                |
| Middleware  | [`src/__tests__/middleware/auth.test.ts`](backend/src/__tests__/middleware/auth.test.ts:1)                     | Session guard rails (`requireAuth`, `requireAdmin`, `optionalAuth`) |
| Services    | [`src/__tests__/services/userService.test.ts`](backend/src/__tests__/services/userService.test.ts:1)           | Business logic, repository integration, filesystem side effects     |

---

## 6. Detailed Coverage: `userService` Tests

### 6.1 Repository Cache Reset

`userService` caches a `UserRepository` singleton; tests now expose `__resetUserRepositoryCache()` to force fresh mocks each run. See implementation in [`src/services/userService.ts`](backend/src/services/userService.ts:12) and helper usage in [`userService.test.ts`](backend/src/__tests__/services/userService.test.ts:60).

### 6.2 Mocking Strategy

- **Repository**: `jest.mock('../../repositories/UserRepository')` injects stubbed CRUD behavior.
- **Filesystem**: `fs/promises.unlink` and `path.resolve` are mocked to verify avatar cleanup without touching disk.
- **bcrypt**: Real hashing is used only where necessary (e.g., verifying hashed password branches).

### 6.3 Scenario Matrix

| Function                     | Scenarios Covered                                                     |
| ---------------------------- | --------------------------------------------------------------------- |
| `createUser`                 | Unique constraint detection, hashing behavior, sanitized responses    |
| `getUserById/Username/Email` | Null handling, sanitization, pass-through for auth                    |
| `updateUser`                 | No-op updates, password re-hash, conflict propagation, generic errors |
| `deleteUser`                 | Avatar cleanup, repository failure detection                          |
| `getAllUsers`                | Role filtering, password stripping                                    |
| `updateAvatar/deleteAvatar`  | File cleanup (including ENOENT), repository updates, sanitization     |
| `verifyPassword`             | Positive/negative bcrypt comparison                                   |

Refer to [`userService.test.ts`](backend/src/__tests__/services/userService.test.ts:1) for concrete assertions.

---

## 7. Middleware Adjustments

While exercising the service tests, we fixed an error in the auth middleware suite:

- `optionalAuth` previously invoked `requireAuth`, preventing unauthenticated requests in tests and production.
- Updated test coverage ensures `optionalAuth` always calls `next()` without mutating response state.

See [`src/__tests__/middleware/auth.test.ts`](backend/src/__tests__/middleware/auth.test.ts:112) for the corrected expectation.

---

## 8. Adding New Tests

1. **Place tests** in `src/__tests__/<feature>/`.
2. **Mock external dependencies** at the top of the file using `jest.mock`.
3. **Reset shared state** (singletons, caches) during `beforeEach`.
4. **Aim for deterministic data**: use fixture factories like `createUserFixture` to standardize base objects.
5. **Update documentation**: After significant additions, append a summary to this file for future maintainers.

---

## 9. Troubleshooting Guide

| Symptom                                          | Likely Cause                  | Resolution                                                                                                    |
| ------------------------------------------------ | ----------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `Your test suite must contain at least one test` | Running setup file as a suite | Ensure files in `setupFilesAfterEnv` are not inside `__tests__`, or rename to `.setup.ts`.                    |
| `User not found` failures in service tests       | Repository cache not reset    | Call `userService.__resetUserRepositoryCache()` before creating a new mocked repository.                      |
| Excessive console noise                          | Winston logger not mocked     | Mock `../../config/logger` to silence transports in the relevant suite.                                       |
| ENOENT errors for avatars                        | Real filesystem paths used    | Keep `path.resolve` mocked to deterministic strings and handle `ENOENT` by design (as done in current tests). |

---

## 10. Recent Improvements (2025-11-23)

- **Expanded Coverage**: Added exhaustive scenarios for `userService` including avatar lifecycle and repository error propagation.
- **Filesystem Safety**: Introduced mocks for `fs/promises` and `path` to assert file deletions without side effects.
- **Repository Reset Hook**: Exported `__resetUserRepositoryCache()` to avoid singleton contamination across tests.
- **Jest Bootstrap Relocation**: Moved setup file to `src/test/setupEnv.ts` to prevent Jest from treating it as a suite.
- **Middleware Fix**: Corrected `optionalAuth` to always delegate to `next()`.

All backend suites now pass (`npm test` within `backend/`), meeting coverage thresholds and ensuring regression safety for future changes.

---
