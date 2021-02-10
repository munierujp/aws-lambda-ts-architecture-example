import { fromOption } from 'fp-ts/lib/Either'
import type { Either } from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/pipeable'
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

  async get (userId: string): Promise<Either<UserNotFoundError, User>> {
    const optionalUser = await this.userRepo.findById(userId)
    return pipe(
      optionalUser,
      fromOption(() => new UserNotFoundError('user not found'))
    )
  }
}
