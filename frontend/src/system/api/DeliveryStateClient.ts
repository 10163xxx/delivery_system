// Business note: frontend typed transport boundary for delivery-state endpoints; keep request and response types aligned with backend routes.
import type { DeliveryAppState } from '@/objects/core/SharedObjects'
import type {
  JsonGetEndpoint,
  JsonPostEndpoint,
} from '@/system/api/TypedApiDefinitions'
import {
  defineJsonGetEndpoint,
  defineJsonPostEndpoint,
  getJson,
  postJson,
  postWithoutBody,
} from '@/system/api/SharedHttpClient'

function toJsonGetEndpoint<Response>(endpoint: string | JsonGetEndpoint<Response>) {
  return typeof endpoint === 'string' ? defineJsonGetEndpoint<Response>(endpoint) : endpoint
}

function toJsonPostEndpoint<Body, Response>(endpoint: string | JsonPostEndpoint<Body, Response>) {
  return typeof endpoint === 'string' ? defineJsonPostEndpoint<Body, Response>(endpoint) : endpoint
}

export function getNormalizedDeliveryState(
  endpoint: string | JsonGetEndpoint<DeliveryAppState>,
) {
  return getJson(toJsonGetEndpoint(endpoint))
}

export function postNormalizedDeliveryState<Body>(
  endpoint: string | JsonPostEndpoint<Body, DeliveryAppState>,
  payload: Body,
) {
  return postJson(toJsonPostEndpoint(endpoint), payload)
}

export function postNormalizedDeliveryStateWithoutBody(
  endpoint: string | JsonPostEndpoint<void, DeliveryAppState>,
) {
  return postWithoutBody(toJsonPostEndpoint(endpoint))
}
