'use strict'

const debug = require('debug')('app:middleware')
const R = require('ramda')
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
  if (Boom.isBoom(err)) {
    const details = R.reject(value => R.isNil(value), { ...err.output.payload, data: err.data })
    return res.status(err.output.statusCode || 500).send(details)
  }

  debug(`Error stack ${err.stack}`)
  const error = Boom.boomify(err)
  return res.status(500).send({ ...error.output.payload, details: err.message })
}

module.exports = errorHandler
