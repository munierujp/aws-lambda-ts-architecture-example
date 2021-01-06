import type { User } from '../domain/models'
import type { UserRepository } from '../domain/repositories'
import type { Executable } from '../types'

export type Result = User

export class Executor implements Executable<Result> {
  private readonly userId: string
  private readonly userRepo: UserRepository

  constructor ({
    userId,
    userRepo
  }: {
    userId: string
    userRepo: UserRepository
  }) {
    this.userId = userId
    this.userRepo = userRepo
  }

  async execute (): Promise<Result> {
    return await this.fetchUser(this.userId)
  }

  private async fetchUser (userId: string): Promise<User> {
    return await this.userRepo.findById(userId)
  }
}
