const js = require('@eslint/js');
const globals = require('globals');
const tseslint = require('typescript-eslint');

module.exports = [
  { ignores: ['dist', 'node_modules', 'coverage', 'database', 'eslint.config.js'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.node,
        ...globals.es2020,
      },
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      // TypeScript-specific rules
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      // General code quality
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],

      // Node.js best practices - relaxed for specific cases
      'no-process-exit': 'warn',
      'handle-callback-err': 'error',
    },
  },
  {
    files: ['**/*.test.ts', '**/__tests__/**/*.ts', 'src/test/**/*.ts'],
    rules: {
      // Relax rules for test files
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
    },
  },
  {
    files: ['*.config.js', 'src/utils/seed.ts'],
    rules: {
      // Allow console and process.exit in utility scripts and config files
      'no-console': 'off',
      'no-process-exit': 'off',
    },
  },
  {
    files: ['jest.config.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        module: 'writable',
      },
    },
  },
];