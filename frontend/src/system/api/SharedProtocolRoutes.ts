import type {
  DemoNote,
  EchoRequest,
  EchoResponse,
  HealthResponse,
  PlannerName,
  SaveDemoNoteRequest,
} from '@/objects/domain/DomainObjects'
import {
  defineJsonGetApi0,
  defineJsonPostApi1,
  routeSegment,
} from '@/system/api/TypedApiDefinitions'

const apiSegment = routeSegment('api')

export const healthApiDefinition = defineJsonGetApi0<HealthResponse>([
  apiSegment,
  routeSegment('health'),
])

export const echoPlannerApiDefinition =
  defineJsonPostApi1<PlannerName, EchoRequest, EchoResponse>(
    [apiSegment],
  )

export const saveDemoNotePlannerApiDefinition =
  defineJsonPostApi1<PlannerName, SaveDemoNoteRequest, DemoNote>(
    [apiSegment],
  )
