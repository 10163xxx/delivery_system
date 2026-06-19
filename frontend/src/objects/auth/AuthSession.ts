// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
import type { SessionToken } from '@/objects/core/SharedObjects'
import type { AuthAccount } from '@/objects/auth/AuthAccount'

export type AuthSession = {
  token: SessionToken
  user: AuthAccount
}
