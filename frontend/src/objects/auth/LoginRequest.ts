import type { Password, UserRole, Username } from '@/objects/domain/DomainObjects'

export type LoginRequest = {
  username: Username
  password: Password
  role: UserRole
}
