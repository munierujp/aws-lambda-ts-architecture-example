import type { APIGatewayProxyEvent } from 'aws-lambda'

export interface Event extends APIGatewayProxyEvent {
  pathParameters: {
    userId: string
  }
}
