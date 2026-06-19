// Business note: frontend API client for the matching backend APIMessage; keep operation names and payload DTOs aligned.
import type { AuthSession, LoginRequest } from '@/objects/core/SharedObjects'
import { postJson } from '@/system/api/SharedHttpClient'
import { defineJsonPostApi0, routeSegment } from '@/system/api/TypedApiDefinitions'

export const loginApiDefinition = defineJsonPostApi0<LoginRequest, AuthSession>([
  routeSegment('api'),
  routeSegment('auth'),
  routeSegment('login'),
])

export function login(payload: LoginRequest) {
  return postJson(loginApiDefinition, payload)
}
