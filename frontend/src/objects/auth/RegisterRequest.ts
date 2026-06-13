import type { Password, UserRole, Username } from '@/objects/core/SharedObjects'

export type RegisterRequest = {
  username: Username
  password: Password
  role: UserRole
}
