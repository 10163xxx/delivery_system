// Business note: frontend API client for the matching backend APIMessage; keep operation names and payload DTOs aligned.
import type {
  DemoNote,
  PlannerName,
  SaveDemoNoteRequest,
} from '@/objects/core/SharedObjects'
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
    payload
  )
}
