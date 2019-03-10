'use strict'

const express = require('express')
const resourceOwner = require('../middleware/resourceOwnerHandler')

const router = new express.Router()

router.use(resourceOwner)

router.get('/', (req, res) => {
  res.status(200).send()
})

router.get('/:userId', (req, res) => {
  res.status(200).send()
})

router.put('/:userId', (req, res) => {
  res.status(204).send()
})

router.patch('/:userId', (req, res) => {
  res.status(204).send()
})

router.delete('/:userId', (req, res) => {
  res.status(200).send()
})

router.post('/:userId/contacts', (req, res) => {
  res.status(201).send()
})

module.exports = router
