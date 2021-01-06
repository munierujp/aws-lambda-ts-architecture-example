import { isEmpty } from 'lodash'
import { UserNotFoundError } from '../../errors'
import type { DynamoDB } from 'aws-sdk'
import type { User } from '../../domain/models'
import type * as repositories from '../../domain/repositories'

export class UserRepository implements repositories.UserRepository {
  private readonly db: DynamoDB.DocumentClient
  private readonly tableName: string

  constructor ({
    db,
    tableName
  }: {
    db: DynamoDB.DocumentClient
    tableName: string
  }) {
    this.db = db
    this.tableName = tableName
  }

  async findById (id: string): Promise<User> {
    const result = await this.db.get({
      TableName: this.tableName,
      Key: { id }
    }).promise()
    const item = result.Item

    if (item === undefined || isEmpty(item)) {
      throw new UserNotFoundError('user not found')
    }

    return item as User
  }
}
