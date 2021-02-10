import {
  isLeft,
  isRight
} from 'fp-ts/lib/Either'
import type {
  Left,
  Right
} from 'fp-ts/lib/Either'
import {
  none,
  some
} from 'fp-ts/lib/Option'
import type { User } from '../../src/domain/models'
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
    describe('if UserRepository#findById returns None', () => {
      const userId = 'test id'

      beforeEach(() => {
        findByIdMock.mockResolvedValue(none)
      })

      it('returns Left<UserNotFoundError>', async () => {
        const errorOrUser = await userGetter.get(userId)
        expect(isLeft(errorOrUser)).toBeTruthy()
        expect((errorOrUser as Left<UserNotFoundError>).left).toBeInstanceOf(UserNotFoundError)
        expect(findByIdMock).toBeCalledTimes(1)
        expect(findByIdMock).toBeCalledWith(userId)
      })
    })

    describe('if UserRepository#findById returns Some<User>', () => {
      const userId = 'test id'
      const user = {
        id: userId,
        name: 'test name'
      }

      beforeEach(() => {
        findByIdMock.mockResolvedValue(some(user))
      })

      it('returns Right<User>', async () => {
        const errorOrUser = await userGetter.get(userId)
        expect(isRight(errorOrUser)).toBeTruthy()
        expect((errorOrUser as Right<User>).right).toBe(user)
        expect(findByIdMock).toBeCalledTimes(1)
        expect(findByIdMock).toBeCalledWith(userId)
      })
    })
  })
})
