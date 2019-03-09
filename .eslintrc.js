'use strict'

module.exports = {
  extends: [
    'plugin:jest/recommended',
    '@strv/node/v10',
    '@strv/node/optional',
    '@strv/node/style',
  ],
  "env": {
    "es6": true,
  },
  "parserOptions": {
    "ecmaVersion": 2018
  }
}