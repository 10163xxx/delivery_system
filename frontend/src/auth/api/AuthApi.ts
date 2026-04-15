import type { AuthSession, LoginRequest, RegisterRequest } from '@/shared/object/SharedObjects'
import { request } from '@/shared/api/SharedHttpClient'
import { AUTH_API_ROUTE } from '@/shared/api/ApiRoutes'

export function login(payload: LoginRequest) {
  return request<AuthSession>(AUTH_API_ROUTE.login, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function register(payload: RegisterRequest) {
  return request<AuthSession>(AUTH_API_ROUTE.register, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function getSession() {
  return request<AuthSession>(AUTH_API_ROUTE.session)
}

export function logout() {
  return request<void>(AUTH_API_ROUTE.logout, {
    method: 'POST',
  })
}
