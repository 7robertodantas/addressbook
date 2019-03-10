'use strict'

const Boom = require('boom')
const authenticate = require('../../middleware/authenticate')
const auth = require('../../models/auth')

jest.mock('../../models/auth')

describe('authenticate middleware', () => {
  it('should require authorization header', () => {
    const sendMock = jest.fn()
    const statusMock = jest.fn(() => ({ send: sendMock }))
    const req = {
      headers: {},
    }
    const res = {
      status: statusMock,
    }
    const next = jest.fn()
    
    expect(() => authenticate(req, res, next)).toThrow(/required/u)
    expect(next).not.toHaveBeenCalled()
  })
  it('should require bearer authorization scheme', () => {
    const sendMock = jest.fn()
    const statusMock = jest.fn(() => ({ send: sendMock }))
    const req = {
      headers: {
        authorization: 'b53c195b-a342-4834-afc6-f7a0f9270383',
      },
    }
    const res = {
      status: statusMock,
    }
    const next = jest.fn()
    expect(() => authenticate(req, res, next)).toThrow(/not supported/u)
    expect(next).not.toHaveBeenCalled()
  })
  it('should give error if auth verify returns empty', () => {
    const sendMock = jest.fn()
    const statusMock = jest.fn(() => ({ send: sendMock }))
    const req = {
      headers: {
        authorization: 'Bearer b53c195b-a342-4834-afc6-f7a0f9270383',
      },
    }
    const res = {
      status: statusMock,
    }
    const next = jest.fn()
    auth.verify.mockImplementation(() => { 
      throw Boom.unauthorized('invalid token') 
    })
    expect(() => authenticate(req, res, next)).toThrow(/invalid token/u)
    expect(next).not.toHaveBeenCalled()
  })
  it('should add authenticated user in request if token is valid', () => {
    const sendMock = jest.fn()
    const statusMock = jest.fn(() => ({ send: sendMock }))
    const req = {
      headers: {
        authorization: 'Bearer b53c195b-a342-4834-afc6-f7a0f9270383',
      },
    }
    const res = {
      status: statusMock,
    }
    const user = {
      id: 'userId',
      name: 'User Name',
      email: 'email@user.com',
    }
    const next = jest.fn()
    auth.verify.mockImplementation(() => user)
    authenticate(req, res, next)
    expect(statusMock).not.toHaveBeenCalledWith()
    expect(sendMock).not.toHaveBeenCalled()
    expect(req.user).toBe(user)
    expect(next).toHaveBeenCalled()
  })
})
