import { getSessionApiDefinition } from '@/system/api/ApiRoutes'
import { decodeAuthSession } from '@/system/api/ResponseDecoders'
import { getJson } from '@/system/api/SharedHttpClient'

export function getSession() {
  return getJson(getSessionApiDefinition, decodeAuthSession)
}
