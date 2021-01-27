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

  it('throws error if it occurred when executing UserGetter', async () => {
    const error = new Error('test error')
    getSpy.mockRejectedValue(error)

    await expect(processGetEvent(event)).rejects.toThrow(error)
    expect(getSpy).toBeCalledTimes(1)
    expect(getSpy).toBeCalledWith(event.pathParameters.userId)
  })

  it(`returns ${StatusCodes.OK} response if succeeded to execute UserGetter`, async () => {
    const user: User = {
      id: 'test id',
      name: 'test name'
    }
    getSpy.mockResolvedValue(user)

    const result = await processGetEvent(event)

    expect(result.statusCode).toBe(StatusCodes.OK)
    expect(JSON.parse(result.body)).toEqual(user)
    expect(getSpy).toBeCalledTimes(1)
    expect(getSpy).toBeCalledWith(event.pathParameters.userId)
  })
})
