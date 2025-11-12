import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import stylistic from '@stylistic/eslint-plugin'

const eslintConfig = defineConfig([
	...nextVitals,
	{
		files: [
			"**/*.{js,ts,jsx,tsx}"
		],
		plugins: {
			'@style': stylistic,
		},
		languageOptions: {
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
		rules: {
			'prefer-const': 'warn',
			'no-unused-vars': 'warn',
			'import/no-anonymous-default-export': 'off',
			'react/no-unescaped-entities': 'off',
			'react-hooks/exhaustive-deps': 'off',
			'react-hooks/incompatible-library': 'off',

			'@style/no-trailing-spaces': 'warn',
			'@style/quotes': ['warn', 'single'],
			'@style/semi': ['warn', 'never'],
			'@style/object-curly-spacing': ['warn', 'always'],
			'@style/jsx-curly-spacing': ['warn', 'always'],
		}
	}
]);

export default eslintConfig;
