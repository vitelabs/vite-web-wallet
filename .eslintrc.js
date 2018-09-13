module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "parserOptions": {
        "parser": "babel-eslint",
        "ecmaFeatures": {
            "jsx": true
        },
        "sourceType": "module"
    },
    "globals": {
        "window": true,
        "describe": true,
        "it": true,
        "viteWallet": true,
        "ViteJS": true,
        "$ViteJS": true
    },
    "extends": [
        "eslint:recommended",
        'plugin:vue/essential'
    ],
    "rules": {
        "indent": ["error", 4],
        "linebreak-style": ["error", "unix"],
        "quotes": ["error", "single"],
        "semi": ["error", "always"],
        "no-console": "off",
        "no-useless-escape": "off",
        "vue/html-indent": ["error", 4],
        'no-debugger': 0,
    }
};