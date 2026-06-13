import type { AuthSession, LoginRequest } from '@/objects/core/SharedObjects'
import { decodeAuthSession } from '@/system/api/ResponseDecoders'
import { postJson } from '@/system/api/SharedHttpClient'
import { defineJsonPostApi0, routeSegment } from '@/system/api/TypedApiDefinitions'

export const loginApiDefinition = defineJsonPostApi0<LoginRequest, AuthSession>([
  routeSegment('api'),
  routeSegment('auth'),
  routeSegment('login'),
])

export function login(payload: LoginRequest) {
  return postJson(loginApiDefinition, payload, decodeAuthSession)
}
