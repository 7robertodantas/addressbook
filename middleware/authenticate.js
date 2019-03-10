'use strict'

const debug = require('debug')('app:middleware')
const Boom = require('boom')
const auth = require('../models/auth')

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
