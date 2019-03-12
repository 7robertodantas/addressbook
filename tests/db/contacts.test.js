'use strict'

const firebase = require('firebase')
const contacts = require('../../db/contacts')


jest.mock('firebase')

describe('contacts db', () => {
  const childContacts = {
    push: jest.fn().mockImplementation(() => ({ key: 'reference-id-123' })),
  }

  const childUserId = {
    child: jest.fn().mockImplementation(() => childContacts),
  }

  const ref = {
    child: jest.fn().mockImplementation(() => childUserId),
  }

  const database = {
    ref: jest.fn().mockImplementation(() => ref),
  }

  beforeAll(() => {
    firebase.database.mockImplementation(() => database)
  })

  describe('save', () => {
    it('should push to firebase and return contact with reference key as id', async () => {
      expect(await contacts.save('userId', { name: 'A contact' }))
        .toEqual({ id: 'reference-id-123', name: 'A contact' })
      expect(childContacts.push).toHaveBeenCalled()
    })
  })
})
