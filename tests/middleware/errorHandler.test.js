'use strict'

const Boom = require('boom')
const errorHandler = require('../../middleware/errorHandler')

describe('errorHandler middleware', () => {
  it('should return 500 in case of missing statusCode', () => {
    const sendMock = jest.fn()
    const statusMock = jest.fn(() => ({ send: sendMock }))
    const req = {
      headers: {},
    }
    const res = {
      status: statusMock,
    }
    const next = jest.fn()
    const err = new Error('unknown error')
    errorHandler(err, req, res, next)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(sendMock).toHaveBeenCalledWith({
      details: err.message,
      error: 'Internal Server Error',
      message: 'An internal server error occurred',
      statusCode: 500,
    })
  })
  it('should return statusCode in case of \'boom\' error type', () => {
    const sendMock = jest.fn()
    const statusMock = jest.fn(() => ({ send: sendMock }))
    const req = {
      headers: {},
    }
    const res = {
      status: statusMock,
    }
    const next = jest.fn()
    const err = Boom.boomify(new Error('custom error'), { statusCode: 999 })
    errorHandler(err, req, res, next)
    expect(res.status).toHaveBeenCalledWith(999)
    expect(sendMock).toHaveBeenCalled()
    expect(sendMock.mock.calls[0][0]).toMatchObject({
      error: 'Unknown',
      message: 'custom error',
      statusCode: 999,
    })
  })
  it('should not include data attribute if it is null', () => {
    const sendMock = jest.fn()
    const statusMock = jest.fn(() => ({ send: sendMock }))
    const req = {
      headers: {},
    }
    const res = {
      status: statusMock,
    }
    const next = jest.fn()
    const err = Boom.badRequest('An error occurred', null)
    errorHandler(err, req, res, next)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(sendMock).toHaveBeenCalledWith({
      error: 'Bad Request',
      message: 'An error occurred',
      statusCode: 400,
    })
  })
  it('should include data attribute if it has content', () => {
    const sendMock = jest.fn()
    const statusMock = jest.fn(() => ({ send: sendMock }))
    const req = {
      headers: {},
    }
    const res = {
      status: statusMock,
    }
    const next = jest.fn()
    const err = Boom.badRequest('An error occurred', {
      id: 1,
      email: 'user@email.com',
    })
    errorHandler(err, req, res, next)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(sendMock).toHaveBeenCalledWith({
      error: 'Bad Request',
      message: 'An error occurred',
      statusCode: 400,
      data: {
        id: 1,
        email: 'user@email.com',
      },
    })
  })
})
