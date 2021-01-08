import middy from '@middy/core'
import { Controller } from '../controllers/users_userId'
import {
  errorHandler,
  validator
} from '../middlewares'
import { importAws } from '../modules'
import type { Handler } from 'aws-lambda'
import type {
  Event,
  Result
} from '../controllers/users_userId'

const aws = importAws({
  xray: '_X_AMZN_TRACE_ID' in process.env
})

export const handler = middyfy(async (event) => {
  const controller = new Controller({ aws })
  return await controller.execute(event)
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
