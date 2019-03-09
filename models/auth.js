'use strict'

const debug = require('debug')('app:models')
const users = require('../db/users')

const login = email => {
  debug(`logging user for email ${email}`)
  const user = users.findByEmail(email)
  if (!user) {
    return null
  }
  return {}
}

const register = user => {
  debug(`registering user ${user}`)
  users.save(user)
}

const verify = token => {
  debug(`verifying token ${token}`)
  return {}
}

module.exports = {
  login,
  register,
  verify,
}
