'use strict'

const debug = require('debug')('app')
const config = require('config')
const app = require('./app')

const port = config.get('port')
const server = app.listen(port, () => {
  debug(`Listening on port ${port}`)
})

module.exports = server
