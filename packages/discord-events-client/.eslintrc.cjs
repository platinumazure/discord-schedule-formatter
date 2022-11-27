module.exports = {
    "env": {
        "node": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:node/recommended",
        "plugin:import/recommended"
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ]
    },
    "settings": {
        "import/resolver": "node"
    }
};
