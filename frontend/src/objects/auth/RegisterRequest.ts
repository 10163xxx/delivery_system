import type { Password, UserRole, Username } from '@/objects/domain/DomainObjects'

export type RegisterRequest = {
  username: Username
  password: Password
  role: UserRole
}
