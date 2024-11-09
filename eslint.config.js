import love from 'eslint-config-love'
import eslintConfigPrettier from 'eslint-config-prettier'

export default [
  {
    rules: {
      '@typescript-eslint/no-magic-numbers': false
    }
  },
  {
    ...love,
    files: ['**/*.js', '**/*.ts']
  },
  eslintConfigPrettier
]
