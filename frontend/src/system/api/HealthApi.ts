import { healthApiDefinition } from '@/system/api/SharedProtocolRoutes'
import { decodeHealthResponse } from '@/system/api/ResponseDecoders'
import { getJson } from '@/system/api/SharedHttpClient'

export function getHealth() {
  return getJson(healthApiDefinition, decodeHealthResponse)
}
