'use strict'

const debug = require('debug')('app:index')
const config = require('config')
const app = require('./app')

const port = config.get('port')
const server = app.listen(port, () => {
  debug(`Listening on port ${port}`)
})

module.exports = server
