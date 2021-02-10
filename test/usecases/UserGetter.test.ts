import {
  none,
  some
} from 'fp-ts/lib/Option'
import { UserNotFoundError } from '../../src/errors'
import { UserGetter } from '../../src/usecases/UserGetter'

describe('UserGetter', () => {
  const findByIdMock = jest.fn()
  const userRepo = {
    findById: findByIdMock
  }
  const userGetter = new UserGetter({ userRepo })

  afterEach(() => {
    findByIdMock.mockReset()
  })

  describe('get()', () => {
    describe('if failed to get user', () => {
      const userId = 'test id'

      beforeEach(() => {
        findByIdMock.mockResolvedValue(none)
      })

      it('throws UserNotFoundError', async () => {
        await expect(userGetter.get(userId)).rejects.toThrow(UserNotFoundError)
        expect(findByIdMock).toBeCalledTimes(1)
        expect(findByIdMock).toBeCalledWith(userId)
      })
    })

    describe('if succeeded to get user', () => {
      const userId = 'test id'
      const user = {
        id: userId,
        name: 'test name'
      }

      beforeEach(() => {
        findByIdMock.mockResolvedValue(some(user))
      })

      it('returns it', async () => {
        await expect(userGetter.get(userId)).resolves.toBe(user)
        expect(findByIdMock).toBeCalledTimes(1)
        expect(findByIdMock).toBeCalledWith(userId)
      })
    })
  })
})
