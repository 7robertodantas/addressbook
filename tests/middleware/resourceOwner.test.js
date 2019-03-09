'use strict'

const resourceOwner = require('../../middleware/resourceOwner')

describe('resourceOwner middleware', () => {
  it('should require authenticated user', () => {
    const sendMock = jest.fn()
    const statusMock = jest.fn(() => ({ send: sendMock }))
    const req = {
      user: null,
      params: {},
    }
    const res = {
      status: statusMock,
    }
    const next = jest.fn()
    resourceOwner(req, res, next)
    expect(statusMock).toHaveBeenCalledWith(401)
    expect(sendMock).toHaveBeenCalled()
    expect(next).not.toHaveBeenCalled()
  })
  it('should forbid if request has userId and is different to the authenticated user', () => {
    const sendMock = jest.fn()
    const statusMock = jest.fn(() => ({ send: sendMock }))
    const req = {
      user: {
        _id: 'ABC321',
        name: 'User Name',
        email: 'email@user.com',
      },
      params: {
        userId: 'ABC111',
      },
    }
    const res = {
      status: statusMock,
    }
    const next = jest.fn()
    resourceOwner(req, res, next)
    expect(statusMock).toHaveBeenCalledWith(403)
    expect(sendMock).toHaveBeenCalled()
    expect(next).not.toHaveBeenCalled()
  })
})
