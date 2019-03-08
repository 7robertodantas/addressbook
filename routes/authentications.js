'use strict'

const express = require('express')

const router = new express.Router()

router.get('/login', (req, res) => {
  res.status(200).send()
})

module.exports = router
