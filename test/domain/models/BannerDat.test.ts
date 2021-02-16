import { isUser } from '../../../src/domain/models/User'

describe('User', () => {
  describe('isUser()', () => {
    describe('if value is valid as User', () => {
      const value = {
        id: 'test id',
        name: 'test name'
      }

      it('returns true', () => {
        expect(isUser(value)).toBe(true)
      })
    })

    describe('if value is invalid as User', () => {
      const value = {
        id: 'test id'
        // missing name
      }

      it('returns false', () => {
        expect(isUser(value)).toBe(false)
      })
    })
  })
})
