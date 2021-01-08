import { StatusCodes } from 'http-status-codes'
import { InvalidMethodError } from '../../src/errors'
import { Controller } from '../../src/controllers/users_userId'
import { userGetter } from '../../src/usecases'
import type AWS from 'aws-sdk'
import type { Event } from '../../src/controllers/users_userId'

describe('Controller', () => {
  const DocumentClientMock = jest.fn()

  const aws = {
    DynamoDB: {
      DocumentClient: DocumentClientMock
    }
  } as unknown as typeof AWS
  const controller = new Controller({ aws })

  afterEach(() => {
    DocumentClientMock.mockReset()
  })

  describe('execute()', () => {
    describe('if httpMethod is GET', () => {
      const executeSpy = jest.spyOn(userGetter.Executor.prototype, 'execute')

      const event = {
        httpMethod: 'GET',
        pathParameters: {
          userId: 'test userId'
        }
      } as unknown as Event

      afterEach(() => {
        executeSpy.mockReset()
      })

      it('returns result if error did not occur when executing executor', async () => {
        const result: userGetter.Result = {
          id: 'test id',
          name: 'test name'
        }
        executeSpy.mockResolvedValue(result)

        await expect(controller.execute(event)).resolves.toEqual({
          statusCode: StatusCodes.OK,
          body: JSON.stringify(result)
        })
        expect(executeSpy).toBeCalledTimes(1)
      })

      it('throws error if it occurred when executing executor', async () => {
        const error = new Error('test error')
        executeSpy.mockRejectedValue(error)

        await expect(controller.execute(event)).rejects.toThrow(error)
        expect(executeSpy).toBeCalledTimes(1)
      })
    })

    it('throws InvalidMethodError if httpMethod is invalid', async () => {
      const event = {
        httpMethod: 'invalid httpMethod'
      } as unknown as Event

      await expect(controller.execute(event)).rejects.toThrow(InvalidMethodError)
    })
  })
})
