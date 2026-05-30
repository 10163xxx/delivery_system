import type { SessionToken } from '@/objects/domain/DomainObjects'
import type { AuthAccount } from '@/objects/auth/AuthAccount'

export type AuthSession = {
  token: SessionToken
  user: AuthAccount
}
