import globals from 'globals';
import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
	{ ignores: ['dist'] },
	{
		files: ['**/*.{js,jsx}'],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
			parserOptions: {
				ecmaFeatures: { jsx: true },
				ecmaVersion: 'latest',
				sourceType: 'module',
			},
		},
		plugins: {
			'react-hooks': reactHooks,
			'react-refresh': reactRefresh,
		},
		rules: {
			...js.configs.recommended.rules,
			...reactHooks.configs.recommended.rules,

			"array-bracket-spacing": [
				"warn"
			],
			"arrow-spacing": [
				"warn"
			],
			"camelcase": [
				"error",
				{
					"allow": [
						"error_y"
					]
				}
			],
			"comma-spacing": [
				"warn"
			],
			"eqeqeq": [
				"error"
			],
			"indent": [
				"error",
				"tab",
				{
					"SwitchCase": 1
				}
			],
			"no-alert": [
				"warn"
			],
			"no-compare-neg-zero": [
				"error"
			],
			"no-console": [
				"warn"
			],
			"no-const-assign": [
				"error"
			],
			"no-debugger": [
				"warn"
			],
			"no-dupe-class-members": [
				"error"
			],
			"no-duplicate-imports": [
				"error"
			],
			"no-irregular-whitespace": [
				"error"
			],
			"no-mixed-spaces-and-tabs": [
				"warn"
			],
			"no-multi-spaces": [
				"warn"
			],
			"no-self-assign": [
				"warn"
			],
			"no-self-compare": [
				"warn"
			],
			"no-trailing-spaces": [
				"warn"
			],
			"no-unreachable": [
				"warn"
			],
			'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
			"no-useless-catch": [
				"warn"
			],
			"no-var": [
				"warn"
			],
			"prefer-const": [
				"warn"
			],
			"prefer-destructuring": [
				"warn"
			],
			"prefer-numeric-literals": [
				"warn"
			],
			"prefer-object-spread": [
				"warn"
			],
			"prefer-template": [
				"warn"
			],
			'react-refresh/only-export-components': [
				'warn',
				{ allowConstantExport: true },
			],
			"semi": [
				"warn",
				"always"
			],
			"sort-imports": [
				"warn",
				{
					"ignoreCase": true
				}
			],
			"sort-keys": [
				"warn"
			],
			"space-in-parens": [
				"warn"
			],
			'space-infix-ops': ['error', { 'int32Hint': false }],
			"spaced-comment": [
				"warn"
			],
			"use-isnan": [
				"error"
			],
			"valid-typeof": [
				"error"
			],
			"vars-on-top": [
				"warn"
			],
		},
	},
];
