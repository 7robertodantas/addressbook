'use strict'

const request = require('supertest')
const app = require('../../../app')

describe('auth', () => {
  describe('POST /login', () => {
    it('should be able to login', done => {
      request(app)
        .post('/login')
        .expect(200, done)
    })
  })
})
