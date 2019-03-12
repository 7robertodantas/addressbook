'use strict'

const R = require('ramda')
const { createLogger, format, transports } = require('winston')
const config = require('config')

const ts = []

if (config.get('logger.file.enabled')) {
  ts.push(new transports.File(config.get('logger.file')))
}

if (config.get('logger.console.enabled')) {
  ts.push(new transports.Console(config.get('logger.console')))
}

const logMeta = log => {
  const meta = R.omit(['level', 'message', 'timestamp'], log)
  return R.isEmpty(meta) ? '' : `- ${JSON.stringify(meta)}`
}

const logFormat = format.printf(log => `${log.timestamp} [${log.level}] - ${log.message}\
 ${logMeta(log)}`)

const logger = createLogger({
  format: format.combine(format.timestamp(), logFormat),
  transports: ts,
})

module.exports = logger
