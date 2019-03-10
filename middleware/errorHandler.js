'use strict'

const debug = require('debug')('app:middleware')
const Boom = require('boom')

const errorHandler = (err, req, res) => {
  debug('Error handler received an error', err, err.stack)

  if (Boom.isBoom(err)) {
    return res.status(err.output.statusCode || 500).send(err.output)
  }

  return res.status(500).send(Boom.boomify(err, {
    message: 'Something went wrong',
  }))
}

module.exports = errorHandler
