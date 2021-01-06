import { HTTPMethod } from 'http-method-enum'
import { InvalidMethodError } from '../errors'
import { UserRepository } from '../interfaces/dynamodb'
import { userGetter } from '../usecases'
import type { APIGatewayProxyEvent } from 'aws-lambda'
import type AWS from 'aws-sdk'
import type { Executable } from '../types'

export interface Event extends APIGatewayProxyEvent {
  pathParameters: {
    userId: string
  }
}
export type Result = userGetter.Result

export class Controller {
  private readonly aws: typeof AWS

  constructor ({
    aws
  }: {
    aws: typeof AWS
  }) {
    this.aws = aws
  }

  async execute (event: Event): Promise<Result> {
    const executor = this.createExecutor(event)
    return await executor.execute()
  }

  private createExecutor (event: Event): Executable<Result> {
    const httpMethod = event.httpMethod.toUpperCase()

    switch (httpMethod) {
      case HTTPMethod.GET:
        return this.createUserGetter(event)
      default:
        throw new InvalidMethodError(`invalid method. httpMethod=${httpMethod}`)
    }
  }

  private createUserGetter (event: Event): userGetter.Executor {
    const { userId } = event.pathParameters
    const db = new this.aws.DynamoDB.DocumentClient()
    const userRepo = new UserRepository({
      db,
      tableName: 'users'
    })
    const executor = new userGetter.Executor({
      userId,
      userRepo
    })
    return executor
  }
}
