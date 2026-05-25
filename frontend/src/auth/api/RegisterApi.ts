import type { RegisterRequest } from '@/shared/object/core/SharedObjects'
import { registerApiDefinition } from '@/shared/api/ApiRoutes'
import { decodeAuthSession } from '@/shared/api/ResponseDecoders'
import { postJson } from '@/shared/api/SharedHttpClient'

export function register(payload: RegisterRequest) {
  return postJson(registerApiDefinition, payload, decodeAuthSession)
}
