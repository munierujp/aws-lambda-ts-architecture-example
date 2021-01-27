import { StatusCodes } from 'http-status-codes'
import { processGetEvent } from '../../../src/handlers/users_userId/processGetEvent'
import { UserGetter } from '../../../src/usecases'
import type { User } from '../../../src/domain/models'
import type { Event } from '../../../src/handlers/users_userId/Event'

describe('processGetEvent()', () => {
  const getSpy = jest.spyOn(UserGetter.prototype, 'get')
  const event = {
    pathParameters: {
      userId: 'test userId'
    }
  } as unknown as Event

  afterEach(() => {
    getSpy.mockReset()
  })

  describe('if error occurred when executing UserGetter', () => {
    const error = new Error('test error')

    beforeEach(() => {
      getSpy.mockRejectedValue(error)
    })

    it('throws it', async () => {
      await expect(processGetEvent(event)).rejects.toThrow(error)
      expect(getSpy).toBeCalledTimes(1)
      expect(getSpy).toBeCalledWith(event.pathParameters.userId)
    })
  })

  describe('if succeeded to execute UserGetter', () => {
    const user: User = {
      id: 'test id',
      name: 'test name'
    }

    beforeEach(() => {
      getSpy.mockResolvedValue(user)
    })

    it(`returns ${StatusCodes.OK} response`, async () => {
      const result = await processGetEvent(event)
      expect(result.statusCode).toBe(StatusCodes.OK)
      expect(JSON.parse(result.body)).toEqual(user)
      expect(getSpy).toBeCalledTimes(1)
      expect(getSpy).toBeCalledWith(event.pathParameters.userId)
    })
  })
})
