'use strict'

const debug = require('debug')('app:middleware')
const Boom = require('boom')

const resourceOwner = (req, res, next) => {
  debug(`Validating if authenticated user matches userId ${req.params.userId} resource`)

  if (!req.user) {
    throw Boom.unauthorized('User is not authenticated.')
  }

  if (req.params.userId && req.user.id !== req.params.userId) {
    throw Boom.forbidden('User does not have permission to access the given resource.')
  }

  return next()
}

module.exports = resourceOwner
