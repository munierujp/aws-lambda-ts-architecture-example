import { isNone } from 'fp-ts/lib/Option'
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
    const optionalUser = await this.userRepo.findById(userId)

    if (isNone(optionalUser)) {
      throw new UserNotFoundError('user not found')
    }

    const user = optionalUser.value
    return user
  }
}
