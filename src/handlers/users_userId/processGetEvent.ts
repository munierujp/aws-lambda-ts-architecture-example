import type { APIGatewayProxyResult } from 'aws-lambda'
import { isLeft } from 'fp-ts/lib/Either'
import { StatusCodes } from 'http-status-codes'
import type { EventProcessor } from '../../types'
import type { UserGetter } from '../../usecases'
import type { Event } from './Event'

export class GetEventProcessor implements EventProcessor<Event, APIGatewayProxyResult> {
  private readonly userGetter: UserGetter

  constructor ({
    userGetter
  }: {
    userGetter: UserGetter
  }) {
    this.userGetter = userGetter
  }

  async process (event: Event): Promise<APIGatewayProxyResult> {
    const { userId } = event.pathParameters
    const errorOrUser = await this.userGetter.get(userId)

    if (isLeft(errorOrUser)) {
      const error = errorOrUser.left
      return {
        statusCode: StatusCodes.NOT_FOUND,
        body: error.message
      }
    }

    const user = errorOrUser.right
    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify(user)
    }
  }
}
