'use strict'

const debug = require('debug')('app')
const config = require('config')
const express = require('express')
const authenticationsRoutes = require('./routes/authentications')
const usersRoutes = require('./routes/users')
const contactsRoutes = require('./routes/contacts')

const app = express()
const port = config.get('port')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(authenticationsRoutes)
app.use(usersRoutes)
app.use(contactsRoutes)
app.listen(port, () => {
  debug(`Listening on port ${port}`)
})

module.exports = app
