import type { User } from '../domain/models'
import type { UserRepository } from '../domain/repositories'
import { UserNotFoundError } from '../errors'

export class UserGetter {
  private readonly userRepo: UserRepository

  constructor ({
    userRepo
  }: {
    userRepo: UserRepository
  }) {
    this.userRepo = userRepo
  }

  async get (userId: string): Promise<User> {
    const user = await this.userRepo.findById(userId)

    if (user === undefined) {
      throw new UserNotFoundError('user not found')
    }

    return user
  }
}
