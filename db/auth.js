'use strict'

const debug = require('debug')('app:db')

const login = email => {
  debug(`logging user for email ${email}`)
}

const verify = token => {
  debug(`verifying token ${token}`)
  return {}
}

module.exports = {
  login,
  verify,
}
