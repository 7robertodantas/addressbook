'use strict'

const debug = require('debug')('app:middleware')
const Boom = require('boom')
const auth = require('../models/auth')

/**
 * This middleware verifies if the current request has 'Authorization'
 * header with Bearer token. If the token is valid, it will add the user
 * contained in the token in the request attribute, as 'request.user'.
 * @param {Request} req current request.
 * @param {Response} res current response.
 * @param {NextFunction} next next handler.
 * @throws {Error} if req.headers.authorization is empty or its
 * token does not match.
 * @returns {*} next().
 */
const authenticate = (req, res, next) => {
  debug('Validating request token')

  const token = req.headers.authorization
  if (!token) {
    throw Boom.unauthorized('Authorization header is required.')
  }

  if (!token.startsWith('Bearer ')) {
    throw Boom.unauthorized('Authorization header scheme is missing or the given scheme \
     is not supported. Only Bearer scheme is supported.')
  }

  const jwt = token.replace('Bearer ', '')
  const user = auth.verify(jwt)
  req.user = user
  return next()
}

module.exports = authenticate