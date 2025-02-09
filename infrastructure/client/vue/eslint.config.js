import js from '@eslint/js';
import vueTsEslintConfig from '@vue/eslint-config-typescript';
import pluginImport from 'eslint-plugin-import';
import pluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import pluginVue from 'eslint-plugin-vue';

export default [
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  ...vueTsEslintConfig(),
  {
    ignores: ['dist/*']
  },
  {
    plugins: {
      import: pluginImport,
      'simple-import-sort': pluginSimpleImportSort
    },
    rules: {
      // generic
      'brace-style':              ['error', 'stroustrup'],
      'object-curly-spacing':     ['error', 'always'],
      'operator-linebreak':       ['error', 'before'],
      'space-before-blocks':      ['error', 'always'],
      'quotes':                   ['warn', 'single'],
      'semi':                     ['warn', 'always'],
      'max-len':                  ['warn', { code: 120 }],
      'keyword-spacing':          ['warn', { before: true, after: true }],
      'indent':                   ['warn', 2, { SwitchCase: 1 }],
      'comma-spacing':            ['warn', { before: false, after: true }],
      'comma-dangle':             ['warn', 'never'],
      'no-multiple-empty-lines':  ['warn', { max: 1 }],
      'space-infix-ops':          ['warn', { int32Hint: false }],

      // vue
      'vue/multi-word-component-names': 'off',
      'vue/component-name-in-template-casing': ['error', 'kebab-case', { registeredComponentsOnly: false }],
      'vue/valid-v-slot': ['error', { allowModifiers: true }],

      // typescript-eslint
      '@typescript-eslint/consistent-type-imports': [1],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          'caughtErrors': 'none',
          'varsIgnorePattern': '^_'
        }
      ],

      // import
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',

      // simple import sort
      'simple-import-sort/imports': ['warn', {
        groups: [
          // eslint-disable-next-line max-len
          ['^(assert|buffer|child_process|cluster|console|constants|crypto|dgram|dns|domain|events|fs|http|https|module|net|os|path|punycode|querystring|readline|repl|stream|string_decoder|sys|timers|tls|tty|url|util|vm|zlib|freelist|v8|process|async_hooks|http2|perf_hooks)(/.*|$)'],
          ['^\\u0000', '^@?\\w', '^', '^\\.']
        ]
      }]
    }
  }
];
