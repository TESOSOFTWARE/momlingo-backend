module.exports = {
    parser: '@typescript-eslint/parser', // Chỉ định parser cho TypeScript
    parserOptions: {
        ecmaVersion: 2020, // Sử dụng ES2020
        sourceType: 'module', // Sử dụng module
        ecmaFeatures: {
            tsx: false, // Không dùng React
        },
    },
    extends: [
        'eslint:recommended', // Quy tắc ESLint mặc định
        'plugin:@typescript-eslint/recommended', // Quy tắc của @typescript-eslint
        'plugin:prettier/recommended', // Kết hợp với Prettier
    ],
    rules: {
        // Thêm hoặc tùy chỉnh các quy tắc ở đây
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        "@typescript-eslint/ban-ts-ignore": "off",
        "@typescript-eslint/no-unused-vars": "off",
        '@typescript-eslint/no-explicit-any': 'off', //off|warn|error // Cảnh báo khi sử dụng any
        'prettier/prettier': 'error', // Lỗi nếu Prettier không đúng
    },
    env: {
        node: true, // Môi trường Node.js
        jest: true, // Môi trường Jest
    },
};
