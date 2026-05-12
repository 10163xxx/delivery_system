import type { Password, Role, Username } from '@/shared/object/domain/DomainObjects'

export type LoginRequest = {
  username: Username
  password: Password
  role: Role
}
