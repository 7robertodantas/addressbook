'use strict'

const express = require('express')
const authenticateHandler = require('./middleware/authenticateHandler')
const errorHandler = require('./middleware/errorHandler')
const notFoundHandler = require('./middleware/notFoundHandler')
const authRoutes = require('./routes/auth')
const usersRoutes = require('./routes/users')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(authRoutes)
app.use(authenticateHandler)
app.use('/users', usersRoutes)
app.use('*', notFoundHandler)
app.use(errorHandler)

module.exports = app
