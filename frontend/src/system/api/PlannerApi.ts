import type {
  DemoNote,
  EchoRequest,
  EchoResponse,
  PlannerName,
  SaveDemoNoteRequest,
} from '@/objects/domain/DomainObjects'
import {
  echoPlannerApiDefinition,
  saveDemoNotePlannerApiDefinition,
} from '@/system/api/SharedProtocolRoutes'
import {
  decodeDemoNote,
  decodeEchoResponse,
} from '@/system/api/ResponseDecoders'
import { buildApiPath1 } from '@/system/api/TypedApiDefinitions'
import { defineJsonPostEndpoint, postJson } from '@/system/api/SharedHttpClient'

function plannerEndpoint<Body, Response>(
  plannerName: PlannerName,
  pathBuilder: typeof echoPlannerApiDefinition | typeof saveDemoNotePlannerApiDefinition,
) {
  return defineJsonPostEndpoint<Body, Response>(
    buildApiPath1(pathBuilder, plannerName),
  )
}

export function runEchoPlanner(plannerName: PlannerName, payload: EchoRequest) {
  return postJson(
    plannerEndpoint<EchoRequest, EchoResponse>(plannerName, echoPlannerApiDefinition),
    payload,
    decodeEchoResponse,
  )
}

export function runSaveDemoNotePlanner(
  plannerName: PlannerName,
  payload: SaveDemoNoteRequest,
) {
  return postJson(
    plannerEndpoint<SaveDemoNoteRequest, DemoNote>(
      plannerName,
      saveDemoNotePlannerApiDefinition,
    ),
    payload,
    decodeDemoNote,
  )
}
