// Business note: frontend API client for the matching backend APIMessage; keep operation names and payload DTOs aligned.
import type { AuthSession } from '@/objects/core/SharedObjects'
import { getJson } from '@/system/api/SharedHttpClient'
import { defineJsonGetApi0, routeSegment } from '@/system/api/TypedApiDefinitions'

export const getSessionApiDefinition = defineJsonGetApi0<AuthSession>([
  routeSegment('api'),
  routeSegment('auth'),
  routeSegment('session'),
])

export function getSession() {
  return getJson(getSessionApiDefinition)
}
