import type { RegisterRequest } from '@/objects/core/SharedObjects'
import { registerApiDefinition } from '@/system/api/ApiRoutes'
import { decodeAuthSession } from '@/system/api/ResponseDecoders'
import { postJson } from '@/system/api/SharedHttpClient'

export function register(payload: RegisterRequest) {
  return postJson(registerApiDefinition, payload, decodeAuthSession)
}
