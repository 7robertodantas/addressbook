'use strict'

const authenticate = require('../../middleware/authenticate')

jest.mock('../../models/auth')
const auth = require('../../models/auth')

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
    authenticate(req, res, next)
    expect(statusMock).toHaveBeenCalledWith(401)
    expect(sendMock).toHaveBeenCalled()
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
    authenticate(req, res, next)
    expect(statusMock).toHaveBeenCalledWith(401)
    expect(sendMock).toHaveBeenCalled()
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
    auth.verify.mockImplementation(() => null)
    authenticate(req, res, next)
    expect(statusMock).toHaveBeenCalledWith(401)
    expect(sendMock).toHaveBeenCalled()
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
    const next = jest.fn()
    const user = {
      _id: 'userId',
      name: 'User Name',
      email: 'email@user.com',
    }
    auth.verify.mockImplementation(() => user)
    authenticate(req, res, next)
    expect(statusMock).not.toHaveBeenCalledWith()
    expect(sendMock).not.toHaveBeenCalled()
    expect(req.user).toBe(user)
    expect(next).toHaveBeenCalled()
  })
})
