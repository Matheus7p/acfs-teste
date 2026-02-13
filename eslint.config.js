import js from "@eslint/js";
import globals from "globals";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import noRelativeImportPaths from "eslint-plugin-no-relative-import-paths";
import importPlugin from "eslint-plugin-import-x";

export default tseslint.config(
  {
    ignores: [
      "dist/**", 
      "node_modules/**", 
      "coverage/**", 
      "eslint.config.js", 
      "vite.config.ts", 
      "jest.config.ts", 
      "jest.setup.ts",
      "commitlint.config.js"
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
      parserOptions: {
        project: ["./tsconfig.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "react-refresh": reactRefresh,
      "no-relative-import-paths": noRelativeImportPaths,
      "import-x": importPlugin,
    },
    settings: {
      react: { version: "detect" },
      "import-x/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: ["./tsconfig.json", "./tsconfig.app.json"],
        },
      },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...importPlugin.configs.recommended.rules,
      ...importPlugin.configs.typescript.rules,
      
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],

      "comma-dangle": ["error", "always-multiline"],
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/require-await": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "semi": ["error", "always"],
      "quotes": ["error", "double"],
      "jsx-quotes": ["error", "prefer-double"],
      "eol-last": "error",
      "indent": ["error", 2],
      "no-multi-spaces": "error",
      "no-multiple-empty-lines": "error",
      "object-property-newline": ["error", { "allowAllPropertiesOnSameLine": true }],
      "space-before-function-paren": ["error", "always"],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/explicit-member-accessibility": "error",
      "@typescript-eslint/explicit-function-return-type": ["error", { "allowExpressions": true }],
      "import-x/no-default-export": "error",

      "@typescript-eslint/naming-convention": [
        "error",
        { "selector": "interface", "format": ["PascalCase"], "custom": { "regex": "^I[A-Z]", "match": true } },
        { "selector": "variable", "types": ["boolean"], "format": ["PascalCase"], "prefix": ["is", "should", "has", "can", "did", "will"] }
      ],

      "import-x/order": [
        "error",
        {
          "groups": ["type", "builtin", "external", "internal", "parent", "index", "object", "sibling"],
          "newlines-between": "always",
          "alphabetize": { "order": "asc" }
        }
      ],
      "no-relative-import-paths/no-relative-import-paths": ["error", { "allowSameFolder": true, "rootDir": "src", "prefix": "@" }],
      "react/react-in-jsx-scope": "off",
    },
  },
  {
    
    files: ["src/main.tsx", "src/App.tsx", "vite.config.ts", "src/**/*.test.tsx", "src/**/*.spec.tsx"],
    rules: { 
      "import-x/no-default-export": "off" 
    }
  }
);