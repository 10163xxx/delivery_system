// Business note: service protocol DTO shared with backend apiTypes; keep field names and value object types aligned.
import type { Password, UserRole, Username } from '@/objects/core/SharedObjects'

export type LoginRequest = {
  username: Username
  password: Password
  role: UserRole
}
