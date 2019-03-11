'use strict'

const debug = require('debug')('app:models')
const Boom = require('boom')
const jwt = require('jsonwebtoken')
const config = require('config')
const users = require('./users')

const secret = config.get('jwt.secretOrPrivateKey')
const options = config.get('jwt.options')

/**
 * Sign a user by email and password and generates a
 * jwt token as result.
 * @param {string} email the user's email to be match.
 * @param {string} password the user's password to be match.
 * @returns {string} signed jwt token.
 * @throws {Error} if no user was found for the given email and password.
 */
const sign = async (email, password) => {
  debug(`logging user for email ${email}`)
  const user = await users.findUserByEmailAndPassword(email, password)
  if (!user) {
    throw Boom.notFound('User with the given email and password was not found.', { email })
  }

  try {
    return jwt.sign({ user }, secret, options.sign)
  } catch (ex) {
    throw Boom.boomify(ex, { statusCode: 500 })
  }
}

/**
 * Validates the given token and return its user.
 * @param {string} token the token to be validated.
 * @returns {user} user that was contained in token.
 * @throws {Error} if token is not valid, malformed,
 * expired or has a bad signature.
 */
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
