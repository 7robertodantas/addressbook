'use strict'

const notFoundHandler = require('../../middleware/notFoundHandler')

describe('notFoundHandler middleware', () => {
  it('should throw not found exception', () => {
    expect(() => notFoundHandler())
      .toThrow(/not found/u)
  })
})
