// Business note: frontend API client for the matching backend APIMessage; keep operation names and payload DTOs aligned.
import type { HealthResponse } from '@/objects/core/SharedObjects'
import { getJson } from '@/system/api/SharedHttpClient'
import { defineJsonGetApi0, routeSegment } from '@/system/api/TypedApiDefinitions'

export const healthApiDefinition = defineJsonGetApi0<HealthResponse>([
  routeSegment('api'),
  routeSegment('health'),
])

export function getHealth() {
  return getJson(healthApiDefinition)
}
