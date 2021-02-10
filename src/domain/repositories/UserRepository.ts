import type { Option } from 'fp-ts/lib/Option'
import type { User } from '../models'

export interface UserRepository {
  findById: (id: string) => Promise<Option<User>>
}
