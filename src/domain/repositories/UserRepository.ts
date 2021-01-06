import type { User } from '../models'

export interface UserRepository {
  findById: (id: string) => Promise<User>
}
