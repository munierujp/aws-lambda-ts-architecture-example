import type { DynamoDB } from 'aws-sdk'
import {
  filter,
  fromNullable
} from 'fp-ts/lib/Option'
import type { Option } from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import { isUser } from '../../domain/models'
import type { User } from '../../domain/models'
import type * as repositories from '../../domain/repositories'

const TABLE_NAME = 'users'

export class UserRepository implements repositories.UserRepository {
  private readonly dynamodb: DynamoDB.DocumentClient

  constructor (dynamodb: DynamoDB.DocumentClient) {
    this.dynamodb = dynamodb
  }

  async findById (id: string): Promise<Option<User>> {
    const result = await this.dynamodb.get({
      TableName: TABLE_NAME,
      Key: { id }
    }).promise()
    return pipe(
      fromNullable(result.Item),
      filter(isUser)
    )
  }
}
