import type { AuthSession, LoginRequest, RegisterRequest } from '@/domain'
import { request } from '@/api/shared/http'

export function login(payload: LoginRequest) {
  return request<AuthSession>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function register(payload: RegisterRequest) {
  return request<AuthSession>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function getSession() {
  return request<AuthSession>('/api/auth/session')
}

export function logout() {
  return request<void>('/api/auth/logout', {
    method: 'POST',
  })
}
