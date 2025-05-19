import eslintPluginPrettier from 'eslint-plugin-prettier';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier: eslintPluginPrettier
    },
    rules: {
      'prettier/prettier': 'off',
      'no-trailing-spaces': 'error',
      'max-len': ['warn', { code: 80 }],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      'brace-style': ['error', 'stroustrup'],
      camelcase: 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' }
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off'
    }
  }
];
