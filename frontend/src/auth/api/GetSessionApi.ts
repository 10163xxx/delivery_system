import { getSessionApiDefinition } from '@/shared/api/ApiRoutes'
import { decodeAuthSession } from '@/shared/api/ResponseDecoders'
import { getJson } from '@/shared/api/SharedHttpClient'

export function getSession() {
  return getJson(getSessionApiDefinition, decodeAuthSession)
}
