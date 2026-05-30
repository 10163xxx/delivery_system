import type { ServiceName, ServiceStatus } from '@/objects/domain/DomainObjects'

export type HealthResponse = {
  status: ServiceStatus
  service: ServiceName
}
