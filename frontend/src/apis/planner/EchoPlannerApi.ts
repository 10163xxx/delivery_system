import type {
  EchoRequest,
  EchoResponse,
  PlannerName,
} from '@/objects/core/SharedObjects'
import { decodeEchoResponse } from '@/system/api/ResponseDecoders'
import { defineJsonPostEndpoint, postJson } from '@/system/api/SharedHttpClient'
import { buildApiPath1, defineJsonPostApi1, routeSegment } from '@/system/api/TypedApiDefinitions'

export const echoPlannerApiDefinition =
  defineJsonPostApi1<PlannerName, EchoRequest, EchoResponse>([
    routeSegment('api'),
  ])

export function runEchoPlanner(plannerName: PlannerName, payload: EchoRequest) {
  return postJson(
    defineJsonPostEndpoint<EchoRequest, EchoResponse>(
      buildApiPath1(echoPlannerApiDefinition, plannerName),
    ),
    payload,
    decodeEchoResponse,
  )
}
