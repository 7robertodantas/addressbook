'use strict'

const debug = require('debug')('app:middleware')
const Boom = require('boom')

/**
 * Checks if the authenticated user is owner of a given resource by checking
 * if its id is the same as the requested in 'userId' path variable.
 * @param {Request} req current request.
 * @param {Response} res current response.
 * @param {NextFunction} next next handler.
 * @throws {Error} if req.user is empty or req.params.userId is different to req.user.id
 * @returns {*} next().
 */
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
