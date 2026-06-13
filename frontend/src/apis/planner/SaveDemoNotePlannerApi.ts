import type {
  DemoNote,
  PlannerName,
  SaveDemoNoteRequest,
} from '@/objects/core/SharedObjects'
import { decodeDemoNote } from '@/system/api/ResponseDecoders'
import { defineJsonPostEndpoint, postJson } from '@/system/api/SharedHttpClient'
import { buildApiPath1, defineJsonPostApi1, routeSegment } from '@/system/api/TypedApiDefinitions'

export const saveDemoNotePlannerApiDefinition =
  defineJsonPostApi1<PlannerName, SaveDemoNoteRequest, DemoNote>([
    routeSegment('api'),
  ])

export function runSaveDemoNotePlanner(
  plannerName: PlannerName,
  payload: SaveDemoNoteRequest,
) {
  return postJson(
    defineJsonPostEndpoint<SaveDemoNoteRequest, DemoNote>(
      buildApiPath1(saveDemoNotePlannerApiDefinition, plannerName),
    ),
    payload,
    decodeDemoNote,
  )
}
