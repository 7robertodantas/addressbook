'use strict'

const express = require('express')
const authenticate = require('./middleware/authenticate')
const errorHandler = require('./middleware/errorHandler')
const authRoutes = require('./routes/auth')
const usersRoutes = require('./routes/users')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(authRoutes)
app.use(authenticate)
app.use('/users', usersRoutes)
app.use(errorHandler)

module.exports = app
