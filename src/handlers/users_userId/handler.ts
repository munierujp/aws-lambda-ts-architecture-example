import type { Handler } from 'aws-lambda'
import { isNone } from 'fp-ts/lib/Option'
import middy from '@middy/core'
import type { MiddyfiedHandler } from '@middy/core'
import { InvalidMethodError } from '../../errors'
import {
  errorHandler,
  validator
} from '../../middlewares'
import { createEventProcessor } from './createEventProcessor'
import type { Event } from './Event'
import type { Result } from './Result'

export const handler = middyfy(async (event) => {
  const { httpMethod } = event
  const optionalProcessor = createEventProcessor(httpMethod)

  if (isNone(optionalProcessor)) {
    throw new InvalidMethodError(`invalid method. httpMethod=${httpMethod}`)
  }

  const processor = optionalProcessor.value
  return await processor.process(event)
})

function middyfy (handler: Handler<Event, Result>): MiddyfiedHandler<Event, Result> {
  return middy(handler)
    .use(validator({
      inputSchema: {
        type: 'object',
        required: [
          'pathParameters'
        ],
        properties: {
          pathParameters: {
            type: 'object',
            required: [
              'userId'
            ],
            properties: {
              userId: {
                type: 'string',
                pattern: '^[0-9a-f]{32}$'
              }
            }
          }
        }
      }
    }))
    .use(errorHandler())
}
