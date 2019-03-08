'use strict'

const express = require('express')

const router = new express.Router()

router.post('/contacts', (req, res) => {
  res.status(201).send()
})

module.exports = router
