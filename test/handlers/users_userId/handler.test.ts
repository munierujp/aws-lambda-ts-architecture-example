import { StatusCodes } from 'http-status-codes'
import { handler } from '../../../src/handlers/users_userId/handler'
import * as processGetEventModule from '../../../src/handlers/users_userId/processGetEvent'
import type { Result } from '../../../src/handlers/users_userId/Result'

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const LambdaTester = require('lambda-tester')

describe('handler()', () => {
  describe('if event.pathParameters does not exist', () => {
    const event = {}

    it(`returns ${StatusCodes.BAD_REQUEST} response`, () => {
      return LambdaTester(handler)
        .event(event)
        .expectResult(({ statusCode }: Result) => {
          expect(statusCode).toBe(StatusCodes.BAD_REQUEST)
        })
    })
  })

  describe('if event.pathParameters.userId does not exist', () => {
    const event = {
      pathParameters: {}
    }

    it(`returns ${StatusCodes.BAD_REQUEST} response`, () => {
      return LambdaTester(handler)
        .event(event)
        .expectResult(({ statusCode }: Result) => {
          expect(statusCode).toBe(StatusCodes.BAD_REQUEST)
        })
    })
  })

  describe('if event.pathParameters.userId is invalid', () => {
    const event = {
      pathParameters: {
        userId: 'invalid userId'
      }
    }

    it(`returns ${StatusCodes.BAD_REQUEST} response`, () => {
      return LambdaTester(handler)
        .event(event)
        .expectResult(({ statusCode }: Result) => {
          expect(statusCode).toBe(StatusCodes.BAD_REQUEST)
        })
    })
  })

  describe('if event is valid', () => {
    const pathParameters = {
      userId: '12345678901234567890123456789012'
    }

    describe('if event.httpMethod is invalid', () => {
      const event = {
        httpMethod: 'invalid httpMethod',
        pathParameters
      }

      it(`returns ${StatusCodes.NOT_IMPLEMENTED} response`, () => {
        return LambdaTester(handler)
          .event(event)
          .expectResult(({ statusCode }: Result) => {
            expect(statusCode).toBe(StatusCodes.NOT_IMPLEMENTED)
          })
      })
    })

    describe('if httpMethod is GET', () => {
      const processGetEventSpy = jest.spyOn(processGetEventModule, 'processGetEvent')
      const event = {
        httpMethod: 'GET',
        pathParameters
      }
      const eventResult: Result = {
        statusCode: StatusCodes.OK,
        body: 'test body'
      }

      beforeEach(() => {
        processGetEventSpy.mockResolvedValue(eventResult)
      })

      afterEach(() => {
        processGetEventSpy.mockReset()
      })

      it('returns response as is', () => {
        return LambdaTester(handler)
          .event(event)
          .expectResult((result: Result) => {
            expect(result).toBe(eventResult)
            expect(processGetEventSpy).toBeCalledTimes(1)
            expect(processGetEventSpy).toBeCalledWith(event)
          })
      })
    })
  })
})
