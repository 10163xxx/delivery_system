type HttpMethod = 'GET' | 'POST'

type ApiKind = 'json' | 'upload'

export type StaticApiSegment = {
  readonly value: string
}

type ParameterizedSegments1 = {
  readonly prefixSegments: StaticApiSegment[]
  readonly suffixSegments: StaticApiSegment[]
}

type ParameterizedSegments2 = {
  readonly prefixSegments: StaticApiSegment[]
  readonly middleSegments: StaticApiSegment[]
  readonly suffixSegments: StaticApiSegment[]
}

export type JsonGetEndpoint<Response> = {
  readonly path: string
  readonly method: HttpMethod
  readonly kind: ApiKind
  readonly __response?: Response
}

export type JsonPostEndpoint<Body, Response> = {
  readonly path: string
  readonly method: HttpMethod
  readonly kind: ApiKind
  readonly __request?: Body
  readonly __response?: Response
}

export type UploadPostEndpoint<Response> = {
  readonly path: string
  readonly method: HttpMethod
  readonly kind: ApiKind
  readonly __response?: Response
}

export type JsonGetEndpointWithParam<Param, Response> = ParameterizedSegments1 & {
  readonly method: 'GET'
  readonly kind: 'json'
  readonly __param?: Param
  readonly __response?: Response
}

export type JsonPostEndpointWithParam<Param, Body, Response> = ParameterizedSegments1 & {
  readonly method: 'POST'
  readonly kind: 'json'
  readonly __param?: Param
  readonly __request?: Body
  readonly __response?: Response
}

export type JsonPostEndpointWithTwoParams<FirstParam, SecondParam, Body, Response> =
  ParameterizedSegments2 & {
    readonly method: 'POST'
    readonly kind: 'json'
    readonly __firstParam?: FirstParam
    readonly __secondParam?: SecondParam
    readonly __request?: Body
    readonly __response?: Response
  }

export function routeSegment(value: string): StaticApiSegment {
  return { value }
}

function joinRouteSegments(segments: string[]) {
  return `/${segments.join('/')}`
}

function renderParam(value: unknown) {
  return String(value)
}

function renderStaticPath(segments: StaticApiSegment[]) {
  return joinRouteSegments(segments.map((segment) => segment.value))
}

export function buildApiPath1(endpoint: ParameterizedSegments1, param: unknown) {
  return joinRouteSegments([
    ...endpoint.prefixSegments.map((segment) => segment.value),
    renderParam(param),
    ...endpoint.suffixSegments.map((segment) => segment.value),
  ])
}

export function buildApiPath2(endpoint: ParameterizedSegments2, firstParam: unknown, secondParam: unknown) {
  return joinRouteSegments([
    ...endpoint.prefixSegments.map((segment) => segment.value),
    renderParam(firstParam),
    ...endpoint.middleSegments.map((segment) => segment.value),
    renderParam(secondParam),
    ...endpoint.suffixSegments.map((segment) => segment.value),
  ])
}

export function defineJsonGetApi0<Response>(segments: StaticApiSegment[]): JsonGetEndpoint<Response> {
  return { path: renderStaticPath(segments), method: 'GET', kind: 'json' }
}

export function defineJsonGetApi1<Param, Response>(
  prefixSegments: StaticApiSegment[],
  suffixSegments: StaticApiSegment[] = [],
): JsonGetEndpointWithParam<Param, Response> {
  return { prefixSegments, suffixSegments, method: 'GET', kind: 'json' }
}

export function defineJsonPostApi0<Body, Response>(
  segments: StaticApiSegment[],
): JsonPostEndpoint<Body, Response> {
  return { path: renderStaticPath(segments), method: 'POST', kind: 'json' }
}

export function defineJsonPostApi1<Param, Body, Response>(
  prefixSegments: StaticApiSegment[],
  suffixSegments: StaticApiSegment[] = [],
): JsonPostEndpointWithParam<Param, Body, Response> {
  return { prefixSegments, suffixSegments, method: 'POST', kind: 'json' }
}

export function defineJsonPostApi2<FirstParam, SecondParam, Body, Response>(
  prefixSegments: StaticApiSegment[],
  middleSegments: StaticApiSegment[],
  suffixSegments: StaticApiSegment[] = [],
): JsonPostEndpointWithTwoParams<FirstParam, SecondParam, Body, Response> {
  return { prefixSegments, middleSegments, suffixSegments, method: 'POST', kind: 'json' }
}

export function defineUploadPostApi0<Response>(
  segments: StaticApiSegment[],
): UploadPostEndpoint<Response> {
  return { path: renderStaticPath(segments), method: 'POST', kind: 'upload' }
}
