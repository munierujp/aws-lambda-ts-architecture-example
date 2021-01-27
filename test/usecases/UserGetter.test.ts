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
    describe('if error occurred when getting user', () => {
      const userId = 'test id'
      const error = new Error('test error')

      beforeEach(() => {
        findByIdMock.mockRejectedValue(error)
      })

      it('throws it', async () => {
        await expect(userGetter.get(userId)).rejects.toThrow(error)
        expect(findByIdMock).toBeCalledTimes(1)
        expect(findByIdMock).toBeCalledWith(userId)
      })
    })

    describe('if error did not occur when getting user', () => {
      const userId = 'test id'
      const user = {
        id: userId,
        name: 'test name'
      }

      beforeEach(() => {
        findByIdMock.mockResolvedValue(user)
      })

      it('returns user', async () => {
        await expect(userGetter.get(userId)).resolves.toBe(user)
        expect(findByIdMock).toBeCalledTimes(1)
        expect(findByIdMock).toBeCalledWith(userId)
      })
    })
  })
})
