import { logoutApiDefinition } from '@/shared/api/ApiRoutes'
import { decodeVoid } from '@/shared/api/ResponseDecoders'
import { postWithoutBody } from '@/shared/api/SharedHttpClient'

export function logout() {
  return postWithoutBody(logoutApiDefinition, decodeVoid)
}
