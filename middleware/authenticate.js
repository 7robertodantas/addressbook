'use strict'

const debug = require('debug')('app:middleware')
const auth = require('../models/auth')

const authenticate = (req, res, next) => {
  debug('Validating request token')

  const token = req.headers.authorization
  if (!token) {
    const error = { message: 'Authorization header is required.' }
    return res.status(401).send(error)
  }

  if (!token.startsWith('Bearer ')) {
    const error = { message: 'Authorization header scheme is missing or the given scheme \
     is not supported. Only Bearer scheme is supported.' }
    return res.status(401).send(error)
  }

  const jwt = token.replace('Bearer ', '')
  const user = auth.verify(jwt)
  if (!user) {
    const error = { message: 'Invalid or expired token.' }
    return res.status(401).send(error)
  }

  req.user = user
  return next()
}

module.exports = authenticate
