import { decodeVoid } from '@/system/api/ResponseDecoders'
import { postWithoutBody } from '@/system/api/SharedHttpClient'
import { defineJsonPostApi0, routeSegment } from '@/system/api/TypedApiDefinitions'

export const logoutApiDefinition = defineJsonPostApi0<void, void>([
  routeSegment('api'),
  routeSegment('auth'),
  routeSegment('logout'),
])

export function logout() {
  return postWithoutBody(logoutApiDefinition, decodeVoid)
}
