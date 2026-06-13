import type { AuthSession } from '@/objects/core/SharedObjects'

export const AUTH_SCREEN_MODE = {
  login: 'login',
  register: 'register',
} as const

export type AuthScreenMode = (typeof AUTH_SCREEN_MODE)[keyof typeof AUTH_SCREEN_MODE]

export type AuthScreenProps = {
  onAuthenticated: (session: AuthSession) => void
}
