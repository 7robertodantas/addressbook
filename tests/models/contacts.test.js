'use strict'

const usersDb = require('../../db/users')
const contactsDb = require('../../db/contacts')
const contacts = require('../../models/contacts')

jest.mock('../../db/users')
jest.mock('../../db/contacts')

describe('contacts models', () => {
  beforeEach(() => {
    usersDb.exists.mockClear()
    contactsDb.save.mockClear()
  })

  describe('saveContact', () => {
    it('should save a valid contact', async () => {
      usersDb.exists.mockImplementation(() => true)
      const contact = {
        name: 'A contact name',
        email: 'contact@email.com',
        address: {
          street: 'A street',
          zipCode: 'A zip code',
        },
      }
      await contacts.saveContact('userId', contact)
      expect(usersDb.exists).toHaveBeenCalled()
      expect(contactsDb.save).toHaveBeenCalledWith('userId', contact)
    })
    it('should throw "name" length must be at least 3 characters long', async () => {
      const contact = {
        name: 'm',
        email: 'contact@email.com',
      }
      usersDb.exists.mockImplementation(() => true)
      await expect(contacts.saveContact('userId', contact))
        .rejects
        .toThrow(/Invalid/u)
    })
    it('should throw "email" must be a valid email', async () => {
      const contact = {
        name: 'A contact name',
        email: 'email.com',
      }
      usersDb.exists.mockImplementation(() => true)
      await expect(contacts.saveContact('userId', contact))
        .rejects
        .toThrow(/Invalid/u)
    })
    it('should throw if email is falsy', async () => {
      const emails = ['', null, NaN, 0, false]
      await Promise.all(emails.map(async invalidEmail => {
        const contact = {
          name: 'Contact Name',
          email: invalidEmail,
        }
        await expect(contacts.saveContact('userId', contact))
          .rejects
          .toThrow(/Invalid/u)
      }))
    })
    it('should throw if name is falsy', async () => {
      const names = ['', null, NaN, 0, false]
      await Promise.all(names.map(async invalidName => {
        const contact = {
          name: invalidName,
          email: 'contact@email.com',
        }
        await expect(contacts.saveContact('userId', contact))
          .rejects
          .toThrow(/Invalid/u)
      }))
    })
  })
})
