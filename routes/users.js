'use strict'

const express = require('express')

const router = new express.Router()

router.post('/users', (req, res) => {
  res.status(201).send()
})

router.get('/users', (req, res) => {
  res.status(200).send()
})

router.get('/users/:id', (req, res) => {
  res.status(200).send()
})

router.put('/users/:id', (req, res) => {
  res.status(204).send()
})

router.patch('/users/:id', (req, res) => {
  res.status(204).send()
})

router.delete('/users/:id', (req, res) => {
  res.status(200).send()
})

router.post('/users/:id/contacts', (req, res) => {
  res.status(201).send()
})

module.exports = router
