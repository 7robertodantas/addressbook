'use strict'

const debug = require('debug')('app:db')

const save = (userId, contact) => {
  debug(`saving userId ${userId} contact ${contact} in firebase`)
}

module.exports = {
  save,
}
