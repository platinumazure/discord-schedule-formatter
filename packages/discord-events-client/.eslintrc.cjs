module.exports = {
    "env": {
        "node": true,
        "es2021": true
    },
    "root": true,
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
    },
    "overrides": [
        {
            "files": ["**/*.ts"],
            "parser": "@typescript-eslint/parser",
            "parserOptions": {
                project: true,
                tsconfigRootDir: __dirname
            },
            "extends": [
                "eslint:recommended",
                "plugin:@typescript-eslint/recommended-type-checked",
                "plugin:node/recommended",
                "plugin:import/recommended"
            ]
        }
    ]
};
