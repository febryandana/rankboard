# Backend Linting Guide

This document describes the ESLint configuration and linting practices for the RankBoard backend service.

## Overview

The backend uses ESLint with TypeScript support to maintain code quality and consistency. The linting setup includes:

- **ESLint 9.x** with flat config format
- **TypeScript ESLint** for TypeScript-specific rules
- **Automatic fixes** for common issues
- **Pre-commit hooks** via Husky and lint-staged

## Running Linters

```bash
# Check for linting errors
npm run lint

# Auto-fix issues where possible
npm run lint:fix
```

## Configuration

The ESLint configuration is located in [`eslint.config.js`](./eslint.config.js) and uses the flat config format (ESLint 9.x).

### Key Rules

#### TypeScript Rules

- `@typescript-eslint/no-explicit-any`: **warn** - Encourages proper typing but allows `any` where necessary
- `@typescript-eslint/no-unused-vars`: **error** - Catches unused variables (with `_` prefix exception)
- `@typescript-eslint/explicit-function-return-type`: **off** - Allows type inference for return types

#### Code Quality Rules

- `curly`: **error** - Requires curly braces for all control statements
- `eqeqeq`: **error** - Requires strict equality (`===` instead of `==`)
- `prefer-const`: **error** - Prefers `const` over `let` where possible
- `no-var`: **error** - Disallows `var` in favor of `let`/`const`

#### Node.js Rules

- `no-console`: **warn** - Warns about console usage (allows `console.warn` and `console.error`)
- `no-process-exit`: **warn** - Warns about `process.exit()` usage

### File-Specific Overrides

#### Test Files (`**/*.test.ts`, `**/__tests__/**/*.ts`)

- `@typescript-eslint/no-explicit-any`: **off** - Relaxed for test mocks
- `no-console`: **off** - Allows console in tests

#### Utility Scripts (`src/utils/seed.ts`, `*.config.js`)

- `no-console`: **off** - Allows console output
- `no-process-exit`: **off** - Allows exit in scripts

## Pre-commit Hooks

ESLint runs automatically on staged files before commits via `lint-staged`. The configuration in the root [`package.json`](../package.json):

```json
"lint-staged": {
  "backend/**/*.{ts,tsx}": [
    "cd backend && eslint --fix",
    "prettier --write"
  ]
}
```

This ensures:

1. ESLint auto-fixes issues
2. Prettier formats the code
3. Only properly linted code is committed

## Current Status

After the initial setup, the codebase has:

- ✅ **0 blocking errors** (after auto-fix)
- ⚠️ **27 warnings** - Mostly acceptable `any` types in specific contexts
- 🔧 **Auto-fix resolved**: 14 curly brace issues

### Remaining Items

The following warnings are acceptable and don't require immediate action:

1. **`@typescript-eslint/no-explicit-any` warnings**: Many are in type definitions, repositories, and services where `any` is appropriate for dynamic database operations
2. **`no-process-exit` warnings**: Used legitimately in server startup/shutdown and environment validation

## Integration with Development Workflow

### During Development

```bash
# Watch mode with linting
npm run dev

# Lint before committing
npm run lint:fix
```

### In CI/CD

Add to your CI pipeline:

```bash
npm run lint  # Fails on errors
npm test      # Run tests
npm run build # Build TypeScript
```

## Customizing Rules

To modify linting rules, edit [`eslint.config.js`](./eslint.config.js):

```javascript
{
  rules: {
    // Make a warning into an error
    '@typescript-eslint/no-explicit-any': 'error',

    // Disable a rule
    'curly': 'off',

    // Add a new rule
    'no-duplicate-imports': 'error',
  }
}
```

## Ignoring Files

Files/directories ignored from linting:

- `dist/` - Build output
- `node_modules/` - Dependencies
- `coverage/` - Test coverage reports
- `database/` - SQLite database files
- `eslint.config.js` - Configuration file itself

See [`.eslintignore`](./.eslintignore) for the complete list.

## Troubleshooting

### "Parsing error" or TypeScript issues

Ensure `tsconfig.json` is valid and TypeScript is installed:

```bash
npm install --save-dev typescript
```

### ESLint not finding files

Check that files match the patterns in `eslint.config.js`:

```javascript
files: ['**/*.{ts,tsx}'];
```

### Pre-commit hook fails

Run manually to see errors:

```bash
cd backend && npm run lint:fix
```

## Resources

- [ESLint Documentation](https://eslint.org/docs/latest/)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [ESLint Rules Reference](https://eslint.org/docs/latest/rules/)
