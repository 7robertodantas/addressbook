'use strict'

const request = require('supertest')
const app = require('../../../app')

describe('auth routes', () => {
  describe('POST /login', () => {
    it('should be able to login', done => {
      request(app)
        .post('/login')
        .expect(200, done)
    })
  })
  describe('POST /register', () => {
    it('should be able to register', done => {
      request(app)
        .post('/register')
        .expect(201, done)
    })
  })
})
