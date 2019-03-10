'use strict'

const debug = require('debug')('app:middleware')
const Boom = require('boom')

/**
 * Not found global error handler.
 * If the request reach this handler it will
 * produce a pretty not found error.
 * @throws {Error} not found error.
 * @returns {void} nothing.
 */
const notFound = () => {
  debug('Requested route was not found.')
  throw Boom.notFound('The requested resource was not found')
}

module.exports = notFound
