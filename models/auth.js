'use strict'

const Boom = require('boom')
const jwt = require('jsonwebtoken')
const config = require('config')
const log = require('../logger')
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
  log.debug(`logging user for email ${email}`)
  const user = await users.findUserByEmailAndPassword(email, password)
  if (!user) {
    throw Boom.notFound('User with the given email and password was not found.', { email })
  }

  return new Promise((resolve, reject) => {
    jwt.sign({ user }, secret, options.sign, (err, encoded) => {
      if (err) {
        return reject(Boom.boomify(err, { statusCode: 500 }))
      }
      return resolve(encoded)
    })
  })
}

/**
 * Validates the given token and return its user.
 * @param {string} token the token to be validated.
 * @returns {user} user that was contained in token.
 * @throws {Error} if token is not valid, malformed,
 * expired or has a bad signature.
 */
const verify = token => {
  log.debug(`verifying token ${token}`)
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, options.verify, (err, decoded) => {
      if (err) {
        return reject(Boom.boomify(err, { statusCode: 401 }))
      }
      const { user } = decoded
      return resolve(user)
    })
  })
}

module.exports = {
  sign,
  verify,
}
