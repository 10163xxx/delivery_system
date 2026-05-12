import { ROLE } from '@/shared/object/domain/DomainObjects'
import type { Password, Role, Username } from '@/shared/object/domain/DomainObjects'

export type RegisterRequest = {
  username: Username
  password: Password
  role: Exclude<Role, typeof ROLE.admin>
}
