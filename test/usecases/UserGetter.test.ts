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
    it('throws error if it occurred when getting user', async () => {
      const userId = 'test id'
      const error = new Error('test error')
      findByIdMock.mockRejectedValue(error)

      await expect(userGetter.get(userId)).rejects.toThrow(error)
      expect(findByIdMock).toBeCalledTimes(1)
      expect(findByIdMock).toBeCalledWith(userId)
    })

    it('returns user if error did not occur', async () => {
      const userId = 'test id'
      const user = {
        id: userId,
        name: 'test name'
      }
      findByIdMock.mockResolvedValue(user)

      await expect(userGetter.get(userId)).resolves.toBe(user)
      expect(findByIdMock).toBeCalledTimes(1)
      expect(findByIdMock).toBeCalledWith(userId)
    })
  })
})
