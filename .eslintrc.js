module.exports = {
    root: true,
    env: { browser: true, es2021: true, node: true },
    parser: '@typescript-eslint/parser',
    parserOptions: { ecmaFeatures: { jsx: true }, ecmaVersion: 'latest', sourceType: 'module' },
    plugins: ['react', '@typescript-eslint'],
    extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:@typescript-eslint/recommended'],
    settings: { react: { version: 'detect' } }
};