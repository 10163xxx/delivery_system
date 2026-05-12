import type { SessionToken } from '@/shared/object/domain/DomainObjects'
import type { AuthUser } from '@/auth/object/AuthUser'

export type AuthSession = {
  token: SessionToken
  user: AuthUser
}
