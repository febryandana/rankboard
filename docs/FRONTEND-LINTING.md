# Frontend Linting Guide

This document describes the ESLint configuration and linting practices for the RankBoard frontend application.

## Overview

The frontend uses ESLint with TypeScript and React support to maintain code quality and consistency. The linting setup includes:

- **ESLint 9.x** with flat config format
- **TypeScript ESLint** for TypeScript-specific rules
- **React Hooks** plugin for React best practices
- **React Refresh** plugin for Fast Refresh compatibility
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
- `@typescript-eslint/consistent-type-imports`: **warn** - Prefers `import type` for type-only imports
- `@typescript-eslint/explicit-function-return-type`: **off** - Allows type inference for return types

#### React Rules

- `react-hooks/rules-of-hooks`: **error** - Enforces Rules of Hooks
- `react-hooks/exhaustive-deps`: **warn** - Validates effect dependencies
- `react-refresh/only-export-components`: **warn** - Ensures Fast Refresh compatibility

#### Code Quality Rules

- `curly`: **error** - Requires curly braces for all control statements
- `eqeqeq`: **error** - Requires strict equality (`===` instead of `==`)
- `prefer-const`: **error** - Prefers `const` over `let` where possible
- `no-var`: **error** - Disallows `var` in favor of `let`/`const`
- `no-duplicate-imports`: **error** - Prevents duplicate import statements

#### General Rules

- `no-console`: **warn** - Warns about console usage (allows `console.warn` and `console.error`)

### File-Specific Overrides

#### Test Files (`**/*.test.{ts,tsx}`, `**/__tests__/**/*.{ts,tsx}`)

- `@typescript-eslint/no-explicit-any`: **off** - Relaxed for test mocks
- `no-console`: **off** - Allows console in tests
- `@typescript-eslint/no-non-null-assertion`: **off** - Allows `!` operator in tests

#### Config Files (`vite.config.ts`)

- `no-console`: **off** - Allows console output
- `@typescript-eslint/consistent-type-imports`: **off** - Relaxed for config imports

#### Test Utilities (`src/test/**/*.{ts,tsx}`)

- Relaxed rules for test utilities and setup files

### Ignored Files

The following files/directories are automatically ignored:

- `dist/` - Build output
- `node_modules/` - Dependencies
- `coverage/` - Test coverage reports
- `.vite/` - Vite cache
- `eslint.config.js` - Configuration file itself
- `*.config.js` - JavaScript configuration files

## Pre-commit Hooks

ESLint runs automatically on staged files before commits via `lint-staged`. The configuration in the root [`package.json`](../package.json):

```json
"lint-staged": {
  "frontend/**/*.{ts,tsx}": [
    "cd frontend && eslint --fix",
    "prettier --write"
  ]
}
```

This ensures:

1. ESLint auto-fixes issues
2. Prettier formats the code
3. Only properly linted code is committed

## Current Status

After the initial setup and auto-fix, the codebase has:

- ✅ **0 blocking errors** in most files
- ⚠️ **5 errors** requiring manual fixes:
  - Duplicate imports (1)
  - Unused variables (4)
- ⚠️ **34 warnings** - Mostly acceptable cases:
  - `any` types in form handlers and error catching
  - React Hook dependency warnings
  - Fast Refresh export warnings for contexts

### Remaining Items

The following warnings are acceptable and don't require immediate action:

1. **`@typescript-eslint/no-explicit-any` warnings**: Many are in error handlers, form submissions, and event handlers where `any` is appropriate
2. **`react-hooks/exhaustive-deps` warnings**: Some useEffect dependencies are intentionally omitted to match component lifecycle needs
3. **`react-refresh/only-export-components` warnings**: Context providers intentionally export both component and hooks

## Integration with Development Workflow

### During Development

```bash
# Dev server with hot reload
npm run dev

# Lint before committing
npm run lint:fix

# Run tests
npm test
```

### In CI/CD

Add to your CI pipeline:

```bash
npm run lint        # Fails on errors
npm test            # Run tests
npm run build       # Build for production
```

## Enhanced Features

The frontend ESLint configuration includes several advanced features not in the basic setup:

### Type-Aware Linting

Uses TypeScript's type information for smarter checks:

```javascript
parserOptions: {
  project: './tsconfig.app.json',
}
```

### Consistent Type Imports

Automatically suggests using `import type` for type-only imports:

```typescript
// Before
import { User } from './types';

// After auto-fix
import type { User } from './types';
```

### React Best Practices

- Enforces proper Hook usage
- Validates Hook dependencies
- Ensures Fast Refresh compatibility

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

### Common Customizations

```javascript
// Stricter type checking
'@typescript-eslint/no-explicit-any': 'error',
'@typescript-eslint/explicit-function-return-type': 'warn',

// Relaxed for rapid development
'react-hooks/exhaustive-deps': 'off',
'@typescript-eslint/no-explicit-any': 'off',

// Additional React rules
'react/prop-types': 'off', // Not needed with TypeScript
'react/react-in-jsx-scope': 'off', // Not needed in React 18
```

## Troubleshooting

### "Parsing error" or TypeScript issues

Ensure TypeScript configuration is valid:

```bash
# Check tsconfig
npx tsc --noEmit

# Ensure dependencies are installed
npm install
```

### ESLint not finding files

Check that files match the patterns in `eslint.config.js`:

```javascript
files: ['**/*.{ts,tsx}'];
```

### Pre-commit hook fails

Run manually to see errors:

```bash
cd frontend && npm run lint:fix
```

### Config file linting errors

JavaScript config files are automatically ignored. If you see errors, ensure they're in the `ignores` array:

```javascript
{
  ignores: ['*.config.js'];
}
```

### Type import warnings

Auto-fix handles most of these:

```bash
npm run lint:fix
```

## Comparison with Backend

Both frontend and backend use similar ESLint setups but with different focuses:

| Aspect                 | Frontend                   | Backend                   |
| ---------------------- | -------------------------- | ------------------------- |
| **Config Format**      | ES Module (flat)           | CommonJS (flat)           |
| **Parser**             | TypeScript + JSX           | TypeScript only           |
| **Special Plugins**    | React Hooks, React Refresh | None                      |
| **Target Environment** | Browser                    | Node.js                   |
| **Type Imports**       | Enforced                   | Optional                  |
| **Console Usage**      | Warned                     | Warned (relaxed in utils) |

## Best Practices

### 1. Fix Errors First

Address errors before warnings:

```bash
npm run lint:fix  # Auto-fix what's possible
# Then manually fix remaining errors
```

### 2. Use Type Imports

For type-only imports, use `import type`:

```typescript
import type { User, Challenge } from './types';
import { api } from './api';
```

### 3. Handle Any Types Properly

When `any` is necessary, add a comment explaining why:

```typescript
// API error responses have dynamic structure
catch (err: any) {
  handleError(err);
}
```

### 4. Respect Hook Dependencies

If disabling exhaustive-deps, document why:

```typescript
useEffect(() => {
  loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []); // Only run on mount
```

### 5. Keep Fast Refresh Working

Ensure components are default exports and contexts export components separately from hooks.

## Resources

- [ESLint Documentation](https://eslint.org/docs/latest/)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [ESLint Rules Reference](https://eslint.org/docs/latest/rules/)
- [React Hooks ESLint Plugin](https://www.npmjs.com/package/eslint-plugin-react-hooks)
- [React Refresh ESLint Plugin](https://www.npmjs.com/package/eslint-plugin-react-refresh)

## Migration Notes

### From ESLint 8.x to 9.x

The frontend uses the new flat config format. Key differences:

- No `.eslintrc` files
- Configuration in `eslint.config.js` as array
- No `.eslintignore` file (use `ignores` in config)
- Different plugin registration syntax

### Upgrading Dependencies

```bash
# Update ESLint and plugins
npm update eslint typescript-eslint @eslint/js
npm update eslint-plugin-react-hooks eslint-plugin-react-refresh
```

### Adding New Rules

Check compatibility with ESLint 9.x before adding plugins.
