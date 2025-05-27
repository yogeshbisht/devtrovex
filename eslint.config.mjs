import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: { globals: globals.browser },
  },
  {
    rules: {
      "no-unused-vars": "warn",
      "react/jsx-uses-react": "off", // React 17+ does not require React to be in scope
      "react/react-in-jsx-scope": "off", // React 17+ does not require React to be in scope
    },
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  pluginReact.configs.recommended,
  js.configs.flat.recommended,
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
]);
