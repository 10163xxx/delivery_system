import type { ServiceName, ServiceStatus } from '@/objects/core/SharedObjects'

export type HealthResponse = {
  status: ServiceStatus
  service: ServiceName
}
