// Business note: frontend API client for the matching backend APIMessage; keep operation names and payload DTOs aligned.
import type { AuthSession, RegisterRequest } from '@/objects/core/SharedObjects'
import { postJson } from '@/system/api/SharedHttpClient'
import { defineJsonPostApi0, routeSegment } from '@/system/api/TypedApiDefinitions'

export const registerApiDefinition = defineJsonPostApi0<RegisterRequest, AuthSession>([
  routeSegment('api'),
  routeSegment('auth'),
  routeSegment('register'),
])

export function register(payload: RegisterRequest) {
  return postJson(registerApiDefinition, payload)
}
