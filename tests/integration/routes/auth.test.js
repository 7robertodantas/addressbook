'use strict'

const request = require('supertest')
const app = require('../../../app')

describe('auth routes', () => {
  describe('POST /register', () => {
    it('should be able to register', done => {
      request(app)
        .post('/register')
        .send({
          name: 'Test Register User',
          email: 'testregister@email.com',
          password: 'testregister',
        })
        .expect(201, done)
    })
  })

  describe('POST /login', () => {
    const agent = request.agent(app)
    const user = {
      name: 'Test Login User',
      email: 'testlogin@email.com',
      password: 'testlogin',
    }

    beforeAll(done => {
      agent.post('/register')
        .send(user)
        .expect(201, done)
    })

    it('should be able to login a registered user', done => {
      request(app)
        .post('/login')
        .send(user)
        .expect(200, done)
    })
  })

})
