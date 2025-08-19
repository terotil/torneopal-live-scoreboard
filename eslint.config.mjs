import js from '@eslint/js';
import html from 'eslint-plugin-html';
import globals from "globals";
import eslintConfigPrettier from "eslint-config-prettier/flat";


export default [
  // Base configuration for all files
  js.configs.recommended,
  
  // Configuration for HTML files
  {
    files: ['*.html'],
    plugins: {
      html
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',
      globals: {
        ...globals.browser
      }
    },
    rules: {
      'no-var': 'error'
    }
  },
  
  // Configuration for Node.js JavaScript files
  {
    files: ['*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        ...globals.nodeBuiltin
      }
    },
    rules: {
      'no-var': 'error'
    }
  },

  // Overrides for Prettier compatibility
  eslintConfigPrettier
];
