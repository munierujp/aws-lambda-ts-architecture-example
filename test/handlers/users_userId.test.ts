import mockContext from 'aws-lambda-mock-context'
import { StatusCodes } from 'http-status-codes'
import { Controller } from '../../src/controllers/users_userId'
import { handler } from '../../src/handlers/users_userId'
import * as createErrorResponseModule from '../../src/modules/createErrorResponse'
import type { Result as ControllerResult } from '../../src/controllers/users_userId'
import type { Result as HandlerResult } from '../../src/handlers/users_userId'

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const LambdaTester = require('lambda-tester')

describe('handler()', () => {
  const executeSpy = jest.spyOn(Controller.prototype, 'execute')
  const createErrorResponseSpy = jest.spyOn(createErrorResponseModule, 'createErrorResponse')

  const context = mockContext()
  const event = {
    pathParameters: {
      userId: '12345678901234567890123456789012'
    }
  }

  afterEach(() => {
    executeSpy.mockReset()
    createErrorResponseSpy.mockReset()
  })

  it('returns success response if error did not occur when executing controller', async () => {
    const controllerResult: ControllerResult = {
      id: 'test id',
      name: 'test name'
    }
    executeSpy.mockResolvedValue(controllerResult)

    await LambdaTester(handler)
      .context(context)
      .event(event)
      .expectResult((result: HandlerResult) => {
        expect(result.statusCode).toBe(StatusCodes.OK)
        expect(JSON.parse(result.body)).toEqual(controllerResult)
        expect(executeSpy).toBeCalledTimes(1)
        expect(createErrorResponseSpy).not.toBeCalled()
      })
  })

  it('returns error response if error occurred when executing controller', async () => {
    const error = new Error('test error')
    executeSpy.mockRejectedValue(error)
    const resp: HandlerResult = {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: 'test body'
    }
    createErrorResponseSpy.mockReturnValue(resp)

    await LambdaTester(handler)
      .context(context)
      .event(event)
      .expectResult((result: HandlerResult) => {
        expect(result).toEqual(resp)
        expect(executeSpy).toBeCalledTimes(1)
        expect(createErrorResponseSpy).toBeCalledTimes(1)
        expect(createErrorResponseSpy).toBeCalledWith(error)
      })
  })

  describe('if validation error occurred', () => {
    const expectBadRequest = async (event: Record<string, any>): Promise<void> => {
      const resp: HandlerResult = {
        statusCode: StatusCodes.BAD_REQUEST,
        body: 'test body'
      }
      createErrorResponseSpy.mockReturnValue(resp)

      await LambdaTester(handler)
        .context(context)
        .event(event)
        .expectResult((result: HandlerResult) => {
          expect(result).toEqual(resp)
          expect(executeSpy).not.toBeCalled()
          expect(createErrorResponseSpy).toBeCalledTimes(1)
        })
    }

    // eslint-disable-next-line jest/expect-expect
    it('returns error response if pathParameters.userId does not exist', async () => {
      await expectBadRequest({
        pathParameters: {}
      })
    })

    // eslint-disable-next-line jest/expect-expect
    it('returns error response if pathParameters.userId is invalid', async () => {
      await expectBadRequest({
        pathParameters: {
          userId: 'invalid userId'
        }
      })
    })
  })
})
