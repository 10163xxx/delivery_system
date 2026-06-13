import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type RoutePathTag = { readonly routePathBrand: never }

export type RoutePath = TextDomainValue<RoutePathTag>
