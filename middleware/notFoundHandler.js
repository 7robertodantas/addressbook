'use strict'

const debug = require('debug')('app:middleware')
const Boom = require('boom')

/**
 * Not found error handler.
 * @throws {Error} not found error.
 * @returns {*} nothing.
 */
const notFound = () => {
  debug('Requested route was not found.')
  throw Boom.notFound('The requested resource was not found')
}

module.exports = notFound
