'use strict'

const request = require('supertest')
const app = require('../../../app')

describe('auth routes', () => {

  describe('POST /register', () => {
    it('should be able to register', async () => {
      await request(app)
        .post('/register')
        .send({
          name: 'Test Register User',
          email: `testuserroutes${Math.random() * Number.MAX_SAFE_INTEGER}@email.com`,
          password: 'testregister',
        })
        .expect(201)
    })
  })

  describe('POST /login', () => {

    const agent = request.agent(app)
    const user = {
      name: 'Test Login User',
      email: `testuserroutes${Math.random() * Number.MAX_SAFE_INTEGER}@email.com`,
      password: 'testlogin',
    }

    beforeAll(async () => {
      await agent.post('/register')
        .send(user)
        .expect(201)
    })

    it('should be able to login a registered user', async () => {
      await request(app)
        .post('/login')
        .send(user)
        .expect(200)
    })
  })

})
