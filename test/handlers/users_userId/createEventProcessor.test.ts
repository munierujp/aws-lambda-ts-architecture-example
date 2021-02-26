import {
  isNone,
  isSome
} from 'fp-ts/lib/Option'
import type { Some } from 'fp-ts/lib/Option'
import { HTTPMethod } from 'http-method-enum'
import { createEventProcessor } from '../../../src/handlers/users_userId/createEventProcessor'
import { GetEventProcessor } from '../../../src/handlers/users_userId/GetEventProcessor'

describe('createEventProcessor()', () => {
  describe('if httpMethod is invalid', () => {
    const httpMethod = 'invalid httpMethod'

    it('returns None', () => {
      const optionalProcessor = createEventProcessor(httpMethod)
      expect(isNone(optionalProcessor)).toBeTruthy()
    })
  })

  describe(`if httpMethod is ${HTTPMethod.GET}`, () => {
    const httpMethod = HTTPMethod.GET

    it('returns Some<GetEventProcessor>', () => {
      const optionalProcessor = createEventProcessor(httpMethod)
      expect(isSome(optionalProcessor)).toBeTruthy()
      expect((optionalProcessor as Some<GetEventProcessor>).value).toBeInstanceOf(GetEventProcessor)
    })
  })
})
