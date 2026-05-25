import type { LoginRequest } from '@/shared/object/core/SharedObjects'
import { loginApiDefinition } from '@/shared/api/ApiRoutes'
import { decodeAuthSession } from '@/shared/api/ResponseDecoders'
import { postJson } from '@/shared/api/SharedHttpClient'

export function login(payload: LoginRequest) {
  return postJson(loginApiDefinition, payload, decodeAuthSession)
}
