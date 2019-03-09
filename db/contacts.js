'use strict'

const debug = require('debug')('app:db')

const save = userId => {
  debug(`saving userId ${userId} contact in firebase`)
}

module.exports = {
  save,
}
