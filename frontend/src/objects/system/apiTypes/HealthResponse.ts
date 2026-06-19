// Business note: system protocol DTO shared with backend system APIs; keep field names and value object types aligned.
import type { ServiceName, ServiceStatus } from '@/objects/core/SharedObjects'

export type HealthResponse = {
  status: ServiceStatus
  service: ServiceName
}
