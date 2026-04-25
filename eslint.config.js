import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

const globals = {
  Buffer: 'readonly',
  URL: 'readonly',
  __dirname: 'readonly',
  afterAll: 'readonly',
  afterEach: 'readonly',
  beforeAll: 'readonly',
  beforeEach: 'readonly',
  console: 'readonly',
  describe: 'readonly',
  expect: 'readonly',
  it: 'readonly',
  module: 'readonly',
  process: 'readonly',
  require: 'readonly',
  setTimeout: 'readonly',
};

export default [
  {
    ignores: [
      '.npm-cache/**',
      '.nyc_output/**',
      'coverage/**',
      'dist/**',
      'node_modules/**',
      'src/**/*.js',
      'example/**/*.js',
      '**/*.css',
      '**/*.html',
      '**/*.windi',
    ],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals,
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
];
