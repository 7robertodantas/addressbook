'use strict'

const request = require('supertest')
const app = require('../../../app')

describe('auth routes', () => {
  let user

  beforeEach(() => {
    user = {
      email: `testuserroutes${Math.random() * Number.MAX_SAFE_INTEGER}@email.com`,
      password: 'testlogin',
    }
  })

  describe('POST /register', () => {
    it('should be able to register', async () => {
      await request(app)
        .post('/register')
        .send(user)
        .expect(201)
    })
  })

  describe('POST /login', () => {
    it('should be able to login a registered user', async () => {
      await request(app)
        .post('/register')
        .send(user)
        .expect(201)

      await request(app)
        .post('/login')
        .send(user)
        .expect(200)
    })
  })

  describe('GET /tokeninfo', () => {
    it('should return token details', async () => {
      const created = await request(app)
        .post('/register')
        .send(user)
        .expect(201)

      const tokenResponse = await request(app)
        .post('/login')
        .send(user)
        .expect(200)

      const tokenInfoResponse = await request(app)
        .get('/tokeninfo')
        .set('Authorization', tokenResponse.header.authorization)
        .send()
        .expect(200)

      expect(tokenInfoResponse.body).toEqual(created.body)
    })
  })
})
