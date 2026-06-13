import type { Password, UserRole, Username } from '@/objects/core/SharedObjects'

export type LoginRequest = {
  username: Username
  password: Password
  role: UserRole
}
