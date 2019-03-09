'use strict'

const request = require('supertest')
const app = require('../../../app')

describe('users routes', () => {
  describe('GET /users', () => {
    it('should be able to get list of users', done => {
      request(app)
        .get('/users')
        .expect(200, done)
    })
  })
  describe('PUT /users/:id', () => {
    it('should be able to update user info', done => {
      request(app)
        .put('/users/userId')
        .expect(204, done)
    })
  })
  describe('PATCH /users/:id', () => {
    it('should be able to patch user info', done => {
      request(app)
        .patch('/users/userId')
        .expect(204, done)
    })
  })
  describe('DELETE /users/:id', () => {
    it('should be able to delete user', done => {
      request(app)
        .delete('/users/userId')
        .expect(200, done)
    })
  })
  describe('POST /users/:id/contacts', () => {
    it('should be able to add a new contact', done => {
      request(app)
        .post('/users/userId/contacts')
        .expect(201, done)
    })
  })
})
