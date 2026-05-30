import type { LoginRequest } from '@/objects/core/SharedObjects'
import { loginApiDefinition } from '@/system/api/ApiRoutes'
import { decodeAuthSession } from '@/system/api/ResponseDecoders'
import { postJson } from '@/system/api/SharedHttpClient'

export function login(payload: LoginRequest) {
  return postJson(loginApiDefinition, payload, decodeAuthSession)
}
