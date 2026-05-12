import type { AuthSession, LoginRequest, RegisterRequest } from '@/shared/object/core/SharedObjects'
import {
  defineJsonGetEndpoint,
  defineJsonPostEndpoint,
  httpClient,
} from '@/shared/api/SharedHttpClient'
import {
  AUTH_LOGIN_API_ROUTE,
  AUTH_LOGOUT_API_ROUTE,
  AUTH_REGISTER_API_ROUTE,
  AUTH_SESSION_API_ROUTE,
} from '@/shared/api/ApiRoutes'

const AUTH_LOGIN_ENDPOINT = defineJsonPostEndpoint<LoginRequest, AuthSession>(AUTH_LOGIN_API_ROUTE)
const AUTH_REGISTER_ENDPOINT = defineJsonPostEndpoint<RegisterRequest, AuthSession>(AUTH_REGISTER_API_ROUTE)
const AUTH_SESSION_ENDPOINT = defineJsonGetEndpoint<AuthSession>(AUTH_SESSION_API_ROUTE)
const AUTH_LOGOUT_ENDPOINT = defineJsonPostEndpoint<void, void>(AUTH_LOGOUT_API_ROUTE)

export const authApi = {
  login(payload: LoginRequest) {
    return httpClient.postJson(AUTH_LOGIN_ENDPOINT, payload)
  },
  register(payload: RegisterRequest) {
    return httpClient.postJson(AUTH_REGISTER_ENDPOINT, payload)
  },
  getSession() {
    return httpClient.getJson(AUTH_SESSION_ENDPOINT)
  },
  logout() {
    return httpClient.postWithoutBody(AUTH_LOGOUT_ENDPOINT)
  },
}

export const { login, register, getSession, logout } = authApi
