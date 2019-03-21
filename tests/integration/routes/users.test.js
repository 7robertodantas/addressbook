'use strict'

const request = require('supertest')
const app = require('../../../app')
const log = require('../../../logger')

describe('users routes', () => {
  const agent = request.agent(app)
  let user
  let token

  beforeEach(async () => {
    user = {
      name: 'Test User Routes',
      email: `testuserroutes${Math.random() * Number.MAX_SAFE_INTEGER}@email.com`,
      password: 'testuserroutes',
    }
    const userResponse = await agent
      .post('/register')
      .send(user)
      .expect(201)

    const loginResponse = await agent
      .post('/login')
      .send(user)
      .expect(200)

    user = userResponse.body
    token = loginResponse.header.authorization
  })

  describe('PUT /users/:userId', () => {
    it('should be able to update user info', async () => {
      await agent
        .put(`/users/${user.id}`)
        .set('Authorization', token)
        .send({
          name: 'Test User Routes Renamed',
          email: 'testuserroutes2@email.com',
          password: 'testuserroutes12313',
        })
        .expect(200)
    })
    it('should require authentication', async () => {
      await agent
        .put(`/users/${user.id}`)
        .send()
        .expect(401)
    })
  })
  describe('PATCH /users/:id', () => {
    it('should be able to patch user info', async () => {
      await agent
        .patch(`/users/${user.id}`)
        .set('Authorization', token)
        .send({
          name: 'Test User Routes Renamed',
          email: 'testuserroutes3@email.com',
          password: 'testeadsasda212232',
        })
        .expect(200)
    })
    it('should require authentication', async () => {
      await agent
        .patch(`/users/${user.id}`)
        .send()
        .expect(401)
    })
  })
  describe('DELETE /users/:userId', () => {
    it('should be able to delete user', async () => {
      await agent
        .delete(`/users/${user.id}`)
        .set('Authorization', token)
        .send()
        .expect(200)
    })
    it('should require authentication', async () => {
      await agent
        .delete(`/users/${user.id}`)
        .send()
        .expect(401)
    })
  })
  describe('POST /users/:userId/contacts', () => {
    it('should be able to add a new contact', async () => {
      await agent
        .post(`/users/${user.id}/contacts`)
        .set('Authorization', token)
        .send({
          name: 'A contact',
          email: 'contact@gmail.com',
        })
        .expect(201)
    })
    it('should require authentication', async () => {
      await agent
        .post(`/users/${user.id}/contacts`)
        .send()
        .expect(401)
    })
  })
})
