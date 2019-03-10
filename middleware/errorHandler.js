'use strict'

const debug = require('debug')('app:middleware')
const Boom = require('boom')

/**
 * Global error handler.
 * @param {Error} err error instance.
 * @param {Request} req current request.
 * @param {Response} res current response.
 * @param {NextFunction} next next handler.
 */
// Unfornately it was needed to declare 'next' attribute here,
// and thus disable eslint no-unused-vars. Even though this
// attribute is not in use, express won't identify it as
// an error middleware if it has 3 or less arguments.
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  debug('Error handler received an error')

  if (Boom.isBoom(err)) {
    return res.status(err.output.statusCode || 500).send(err.output.payload)
  }

  const error = Boom.boomify(err, {
    message: 'Something went wrong',
  })
  return res.status(500).send(error.output.payload)
}

module.exports = errorHandler
