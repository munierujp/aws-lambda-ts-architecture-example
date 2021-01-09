import { UserGetter } from '../../src/usecases/UserGetter'
import type { User } from '../../src/domain/models'

describe('UserGetter', () => {
  const findByIdMock = jest.fn()

  const userId = 'test userId'
  const userRepo = {
    findById: findByIdMock
  }
  const userGetter = new UserGetter({ userRepo })

  afterEach(() => {
    findByIdMock.mockReset()
  })

  describe('get()', () => {
    it('returns user if error did not occur', async () => {
      const user: User = {
        id: 'test id',
        name: 'test name'
      }
      findByIdMock.mockResolvedValue(user)

      await expect(userGetter.get(userId)).resolves.toBe(user)
      expect(findByIdMock).toBeCalledTimes(1)
      expect(findByIdMock).toBeCalledWith(userId)
    })

    it('throws error if it occurred when getting user', async () => {
      const error = new Error('test error')
      findByIdMock.mockRejectedValue(error)

      await expect(userGetter.get(userId)).rejects.toThrow(error)
      expect(findByIdMock).toBeCalledTimes(1)
      expect(findByIdMock).toBeCalledWith(userId)
    })
  })
})
