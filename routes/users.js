'use strict'

const express = require('express')
const config = require('config')
const resourceOwner = require('../middleware/resourceOwnerHandler')
const users = require('../models/users')
const contacts = require('../models/contacts')
const { wrap } = require('./utils')

const router = new express.Router()

router.param('userId', resourceOwner)

router.post('/', wrap(async (req, res) => {
  const user = await users.saveUser(req.body)
  res.set('Location', `${req.baseUrl}/users/${user.id}`)
    .status(201)
    .send(user)
}))

router.get('/:userId', wrap(async (req, res) => {
  const user = await users.findUser(req.params.userId)
  res.status(200).send(user)
}))

router.put('/:userId', wrap(async (req, res) => {
  const user = await users.replaceUser(req.params.userId, req.body)
  res.status(200).send(user)
}))

router.patch('/:userId', wrap(async (req, res) => {
  const user = await users.patchUser(req.params.userId, req.body)
  res.status(200).send(user)
}))

router.delete('/:userId', wrap(async (req, res) => {
  const user = await users.deleteUser(req.params.userId)
  res.status(200).send(user)
}))

router.post('/:userId/contacts', wrap(async (req, res) => {
  const userId = req.params.userId
  const contact = req.body
  const created = await contacts.saveContact(userId, contact)
  const location = `${config.get('firebase.databaseURL')}\
  /users/${userId}/contacts/${created.id}.json`
  res
    .set('Location', location)
    .status(201)
    .send(created)
}))

module.exports = router
