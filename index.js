'use strict'

const config = require('config')
const log = require('./logger')
const app = require('./app')

const port = config.get('port')
const server = app.listen(port, () => {
  log.info(`listening on port ${port}`)
})

module.exports = server
