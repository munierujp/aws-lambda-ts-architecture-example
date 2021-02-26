import {
  none,
  some
} from 'fp-ts/lib/Option'
import { StatusCodes } from 'http-status-codes'
import type { Event } from '../../../src/handlers/users_userId/Event'
import * as createEventProcessorModule from '../../../src/handlers/users_userId/createEventProcessor'
import { handler } from '../../../src/handlers/users_userId/handler'
import * as processGetEventModule from '../../../src/handlers/users_userId/processGetEvent'
import type { Result } from '../../../src/handlers/users_userId/Result'
import type { EventProcessor } from '../../../src/types'

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
    const createEventProcessorSpy = jest.spyOn(createEventProcessorModule, 'createEventProcessor')
    const event = {
      pathParameters: {
        userId: '12345678901234567890123456789012'
      }
    }

    afterEach(() => {
      createEventProcessorSpy.mockReset()
    })

    describe('if createEventProcessor returns None', () => {
      beforeEach(() => {
        createEventProcessorSpy.mockReturnValue(none)
      })

      it(`returns ${StatusCodes.NOT_IMPLEMENTED} response`, () => {
        return LambdaTester(handler)
          .event(event)
          .expectResult(({ statusCode }: Result) => {
            expect(statusCode).toBe(StatusCodes.NOT_IMPLEMENTED)
          })
      })
    })

    describe('if createEventProcessor returns Some<EventProcessor<Event>>', () => {
      const processGetEventSpy = jest.spyOn(processGetEventModule, 'processGetEvent')
      const processor = {
        process: processGetEventSpy
      } as unknown as EventProcessor<Event>
      const eventResult: Result = {
        statusCode: StatusCodes.OK,
        body: 'test body'
      }

      beforeEach(() => {
        processGetEventSpy.mockResolvedValue(eventResult)
        createEventProcessorSpy.mockReturnValue(some(processor))
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
