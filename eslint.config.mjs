import { FlatCompat } from "@eslint/eslintrc"
import tailwind from "eslint-plugin-tailwindcss"
import { dirname } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  {
    ignores: ["**/node_modules/*", "**/out/*", "**/.next/*", ".source", "**/coverage"],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  ...tailwind.configs["flat/recommended"],
  {
    settings: {
      react: {
        version: "detect",
      },
      tailwindcss: {
        config: "./tailwind.config.ts",
        callees: ["clsx", "cva", "cn", "tv"],
      },
    },
  },
  {
    rules: {
      "import/no-anonymous-default-export": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "tailwindcss/no-custom-classname": "off",
      "tailwindcss/enforces-negative-arbitrary-values": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
]

export default eslintConfig
