import { StatusCodes } from 'http-status-codes'
import middy from '@middy/core'
import validator from '@middy/validator'
import { Controller } from '../controllers/users_userId'
import {
  createErrorResponse,
  importAws
} from '../modules'
import type {
  APIGatewayProxyResult,
  Handler
} from 'aws-lambda'
import type { Event } from '../controllers/users_userId'

const aws = importAws({
  xray: '_X_AMZN_TRACE_ID' in process.env
})

export type Result = APIGatewayProxyResult

export const handler = middyfy(async (event) => {
  const controller = new Controller({ aws })

  try {
    const result = await controller.execute(event)
    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify(result)
    }
  } catch (e) {
    return createErrorResponse(e)
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
}
