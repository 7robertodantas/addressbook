'use strict'

const express = require('express')

const router = new express.Router()

router.post('/login', (req, res) => {
  res.status(200).send()
})

module.exports = router
