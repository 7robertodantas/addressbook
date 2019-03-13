'use strict'

const R = require('ramda')
const { createLogger, format, transports } = require('winston')
const config = require('config')

/**
 * Holds the configured transports.
 */
const ts = []

/**
 * Add file transport if enabled in configuration.
 */
if (config.get('logger.file.enabled')) {
  ts.push(new transports.File(config.get('logger.file')))
}

/**
 * Add console transport if enabled in configuration.
 */
if (config.get('logger.console.enabled')) {
  ts.push(new transports.Console(config.get('logger.console')))
}

/**
 * The "metadata" came along with the level, message and timestamp
 * attributes, so, in order to get metadata it is needed to omit
 * these attributes and get the rest of it.
 * @param {Object} log entry
 * @param {string} log.level log level
 * @param {string} log.message log message
 * @param {string} log.timestamp log timestamp
 * @returns {string} formatted log
 */
const logMeta = log => {
  const meta = R.omit(['level', 'message', 'timestamp'], log)
  return R.isEmpty(meta) ? '' : `- ${JSON.stringify(meta)}`
}

/**
 * Function that formats a given log in the format of:
 * timestamp [level] - message - { metadata object }
 */
const logFormat = format.printf(log => `${log.timestamp} [${log.level}] - ${log.message}\
 ${logMeta(log)}`)

/**
  * Create winston instance of logger.
  */
const logger = createLogger({
  format: format.combine(format.timestamp(), logFormat),
  transports: ts,
})

module.exports = logger
