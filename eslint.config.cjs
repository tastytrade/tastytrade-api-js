const {
    defineConfig,
} = require("eslint/config");

const tsParser = require("@typescript-eslint/parser");
const typescriptEslint = require("@typescript-eslint/eslint-plugin");
const js = require("@eslint/js");

const {
    FlatCompat,
} = require("@eslint/eslintrc");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

module.exports = defineConfig([{
    extends: compat.extends("eslint:recommended", "plugin:@typescript-eslint/recommended"),

    languageOptions: {
        parser: tsParser,
    },

    plugins: {
        "@typescript-eslint": typescriptEslint,
    },

    rules: {
        "@typescript-eslint/no-inferrable-types": "warn",

        "@typescript-eslint/no-unused-vars": ["error", {
            "argsIgnorePattern": "^_",
            "varsIgnorePattern": "^_",
            "caughtErrorsIgnorePattern": "^_",
        }],

        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-explicit-any": "off"
    },
}]);
