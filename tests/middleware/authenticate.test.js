'use strict'

const Boom = require('boom')
const authenticate = require('../../middleware/authenticateHandler')
const auth = require('../../models/auth')

jest.mock('../../models/auth')

describe('authenticate middleware', () => {
  it('should require authorization header', async () => {
    const sendMock = jest.fn()
    const statusMock = jest.fn(() => ({ send: sendMock }))
    const req = {
      headers: {},
    }
    const res = {
      status: statusMock,
    }
    const next = jest.fn()
    await authenticate(req, res, next)
    const error = next.mock.calls[0][0]
    expect(Boom.isBoom(error)).toBeTruthy()
    expect(error.output.payload).toMatchObject({
      error: 'Unauthorized',
      message: expect.stringMatching(/required/u),
      statusCode: 401,
    })
  })
  it('should require bearer authorization scheme', async () => {
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
    await authenticate(req, res, next)
    const error = next.mock.calls[0][0]
    expect(Boom.isBoom(error)).toBeTruthy()
    expect(error.output.payload).toMatchObject({
      error: 'Unauthorized',
      message: expect.stringMatching(/not supported/u),
      statusCode: 401,
    })
  })
  it('should give error if auth verify returns empty', async () => {
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
    await authenticate(req, res, next)
    const error = next.mock.calls[0][0]
    expect(Boom.isBoom(error)).toBeTruthy()
    expect(error.output.payload).toMatchObject({
      error: 'Unauthorized',
      message: expect.stringMatching(/invalid token/u),
      statusCode: 401,
    })
  })
  it('should add authenticated user in request if token is valid', async () => {
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
    await authenticate(req, res, next)
    expect(statusMock).not.toHaveBeenCalledWith()
    expect(sendMock).not.toHaveBeenCalled()
    expect(req.user).toBe(user)
    expect(next).toHaveBeenCalled()
  })
})
