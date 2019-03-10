'use strict'

const express = require('express')
const auth = require('../models/auth')
const users = require('../models/users')
const { wrap } = require('./utils')

const router = new express.Router()

router.post('/login', wrap(async (req, res) => {
  const token = await auth.sign(req.body.email, req.body.password)
  res.status(200).send({
    accessToken: token,
    tokenType: 'bearer',
  })
}))

router.post('/register', wrap(async (req, res) => {
  const user = await users.saveUser(req.body)
  res.set('Location', `${req.baseUrl}/users/${user.id}`)
    .status(201)
    .send(user)
}))

module.exports = router
