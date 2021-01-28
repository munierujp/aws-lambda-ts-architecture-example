import type { User } from '../domain/models'
import type { UserRepository } from '../domain/repositories'

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
    return await this.userRepo.findById(userId)
  }
}
