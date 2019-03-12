'use strict'

const R = require('ramda')
const Boom = require('boom')
const log = require('../logger')

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
  // Boom error already have some details.
  if (Boom.isBoom(err)) {
    const details = R.reject(value => R.isNil(value), { ...err.output.payload, data: err.data })
    log.error(`${req.originalUrl} - ${req.method} - ${req.ip} `, details)
    return res.status(err.output.statusCode || 500).send(details)
  }
  // Standard error - converting into boomify to prettify it
  const error = Boom.boomify(err)
  const response = { ...error.output.payload, details: err.message }
  log.error(`${req.originalUrl} - ${req.method} - ${req.ip} `, response)
  return res.status(500).send(response)
}

module.exports = errorHandler
