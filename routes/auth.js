'use strict'

const express = require('express')
const auth = require('../models/auth')
const users = require('../models/users')
const authentication = require('../middleware/authenticateHandler')
const { wrap } = require('./utils')

const router = new express.Router()

/**
 * Signs an user by email and password.
 * It generates a token that is included in response header as
 * Authorization Bearer and in the response payload body.
 */
router.post('/login', wrap(async (req, res) => {
  const token = await auth.sign(req.body.email, req.body.password)
  res.status(200)
    .set('Authorization', `Bearer ${token}`)
    .send({
      accessToken: token,
      tokenType: 'bearer',
    })
}))

/**
 * Register an user in database and returns it
 * with the generated id and response header location.
 */
router.post('/register', wrap(async (req, res) => {
  const user = await users.saveUser(req.body)
  res.set('Location', `${req.baseUrl}/users/${user.id}`)
    .status(201)
    .send(user)
}))

/**
 * Return the current token info
 */
router.get('/tokeninfo', authentication, (req, res) => {
  res.status(200).send(req.user)
})

module.exports = router
