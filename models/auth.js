'use strict'

const debug = require('debug')('app:models')
const Boom = require('boom')
const jwt = require('jsonwebtoken')
const config = require('config')
const users = require('./users')

const secret = config.get('jwt.secretOrPrivateKey')
const options = config.get('jwt.options')

const sign = (email, password) => {
  debug(`logging user for email ${email}`)
  const user = users.findByEmailAndPassword(email, password)
  if (!user) {
    throw Boom.notFound('User with the given email and password was not found.', { email })
  }

  try {
    return jwt.sign({ user }, secret, options.sign)
  } catch (ex) {
    throw Boom.boomify(ex, { statusCode: 500 })
  }
}

const verify = token => {
  debug(`verifying token ${token}`)
  try {
    const { user } = jwt.verify(token, secret, options.verify)
    return user
  } catch (ex) {
    throw Boom.boomify(ex, { statusCode: 401 })
  }
}

module.exports = {
  sign,
  verify,
}
