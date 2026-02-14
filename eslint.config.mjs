import { defineConfig } from 'eslint/config'
import tseslint from '@electron-toolkit/eslint-config-ts'
import eslintConfigPrettier from '@electron-toolkit/eslint-config-prettier'
import eslintPluginReact from 'eslint-plugin-react'
import eslintPluginReactHooks from 'eslint-plugin-react-hooks'
import eslintPluginReactRefresh from 'eslint-plugin-react-refresh'
// 1. Import the GraphQL plugin
import graphqlPlugin from '@graphql-eslint/eslint-plugin'

export default defineConfig(
  { ignores: ['**/node_modules', '**/dist', '**/out'] },
  tseslint.configs.recommended,
  eslintPluginReact.configs.flat.recommended,
  eslintPluginReact.configs.flat['jsx-runtime'],
  {
    settings: {
      react: {
        version: 'detect'
      }
    }
  },

  // 2. Add Configuration for standalone GraphQL files (.graphql)
  {
    files: ['**/*.graphql'],
    languageOptions: {
      parser: graphqlPlugin.parser,
      parserOptions: {
        // Point this to your schema location or config file
        schema: './graphql.config.yml',
        operations: ['./src/**/*.{ts,tsx,graphql}']
      }
    },
    plugins: {
      '@graphql-eslint': graphqlPlugin
    },
    rules: {
      ...graphqlPlugin.configs['flat/operations-recommended'].rules
    }
  },

  // 3. Update your existing TS/TSX config
  {
    files: ['**/*.{ts,tsx}'],
    // This processor extracts GraphQL tags from your TSX files
    processor: graphqlPlugin.processor,
    plugins: {
      'react-hooks': eslintPluginReactHooks,
      'react-refresh': eslintPluginReactRefresh,
      // Add the plugin here so rules can run on extracted tags
      '@graphql-eslint': graphqlPlugin
    },
    rules: {
      ...eslintPluginReactHooks.configs.recommended.rules,
      ...eslintPluginReactRefresh.configs.vite.rules,

      // GraphQL Rules for your TSX files
      "@graphql-eslint/known-type-names": "error",
      "@graphql-eslint/fields-on-correct-type": "error",

      // Existing React/TS rules
      "react/react-in-jsx-scope": "off",
      "react/display-name": "off",
      "react/no-unknown-property": "off",
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "@typescript-eslint/explicit-function-return-type": "off"
    }
  },
)
