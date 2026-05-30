import { logoutApiDefinition } from '@/system/api/ApiRoutes'
import { decodeVoid } from '@/system/api/ResponseDecoders'
import { postWithoutBody } from '@/system/api/SharedHttpClient'

export function logout() {
  return postWithoutBody(logoutApiDefinition, decodeVoid)
}
