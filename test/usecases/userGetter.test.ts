import { Executor } from '../../src/usecases/userGetter'
import type { User } from '../../src/domain/models'

describe('Executor', () => {
  const findByIdMock = jest.fn()

  const userId = 'test userId'
  const userRepo = {
    findById: findByIdMock
  }
  const executor = new Executor({
    userId,
    userRepo
  })

  afterEach(() => {
    findByIdMock.mockReset()
  })

  describe('execute()', () => {
    it('returns user if error did not occur', async () => {
      const user: User = {
        id: 'test id',
        name: 'test name'
      }
      findByIdMock.mockResolvedValue(user)

      await expect(executor.execute()).resolves.toBe(user)
      expect(findByIdMock).toBeCalledTimes(1)
      expect(findByIdMock).toBeCalledWith(userId)
    })

    it('throws error if it occurred when getting user', async () => {
      const error = new Error('test error')
      findByIdMock.mockRejectedValue(error)

      await expect(executor.execute()).rejects.toThrow(error)
      expect(findByIdMock).toBeCalledTimes(1)
      expect(findByIdMock).toBeCalledWith(userId)
    })
  })
})
