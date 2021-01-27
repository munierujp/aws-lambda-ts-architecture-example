import { HTTPMethod } from 'http-method-enum'
import middy from '@middy/core'
import { InvalidMethodError } from '../../errors'
import {
  errorHandler,
  validator
} from '../../middlewares'
import { processGetEvent } from './processGetEvent'
import type { Handler } from 'aws-lambda'
import type { Event } from './Event'
import type { Result } from './Result'

export const handler = middyfy(async (event) => {
  const httpMethod = event.httpMethod.toUpperCase()

  switch (httpMethod) {
    case HTTPMethod.GET:
      return await processGetEvent(event)
    default:
      throw new InvalidMethodError(`invalid method. httpMethod=${httpMethod}`)
  }
})

function middyfy (handler: Handler<Event, Result>): middy.Middy<Event, Result> {
  return middy(handler)
    .use(validator({
      inputSchema: {
        type: 'object',
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
