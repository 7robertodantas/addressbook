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
// Unfornately we need to declare 'next' attribute here even though
// we do not use it. Without it express would not identify this handler
// function as error middleware.
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
