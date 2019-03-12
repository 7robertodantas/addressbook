'use strict'

const express = require('express')
const config = require('config')
const resourceOwner = require('../middleware/resourceOwnerHandler')
const users = require('../models/users')
const contacts = require('../models/contacts')
const { wrap } = require('./utils')

const router = new express.Router()

/**
 * Adds a middleware to check if the authenticated user
 * is the owner/same as the 'userId' requests. This assumes
 * that an authenticated user should not have access to another
 * other user's data.
 */
router.param('userId', resourceOwner)

/**
 * Fetch the user info.
 */
router.get('/:userId', wrap(async (req, res) => {
  const user = await users.findUser(req.params.userId)
  res.status(200).send(user)
}))

/**
 * Replace all user info.
 */
router.put('/:userId', wrap(async (req, res) => {
  const user = await users.replaceUser(req.params.userId, req.body)
  res.status(200).send(user)
}))

/**
 * Partial update in the user info.
 */
router.patch('/:userId', wrap(async (req, res) => {
  const user = await users.patchUser(req.params.userId, req.body)
  res.status(200).send(user)
}))

/**
 * Delete the user.
 */
router.delete('/:userId', wrap(async (req, res) => {
  const user = await users.deleteUser(req.params.userId)
  res.status(200).send(user)
}))

/**
 * Create a new user contact.
 */
router.post('/:userId/contacts', wrap(async (req, res) => {
  const userId = req.params.userId
  const contact = req.body
  const created = await contacts.saveContact(userId, contact)
  const baseLocation = config.get('firebase.databaseURL')
  res
    .set('Location', `${baseLocation}/users/${userId}/contacts/${created.id}.json`)
    .status(201)
    .send(created)
}))

module.exports = router
