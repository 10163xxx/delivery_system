import type { SessionToken } from '@/objects/core/SharedObjects'
import type { AuthAccount } from '@/objects/auth/AuthAccount'

export type AuthSession = {
  token: SessionToken
  user: AuthAccount
}
