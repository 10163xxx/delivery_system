import type { TimeOfDay } from '@/objects/domain/DomainObjects'

export type BusinessHours = {
  openTime: TimeOfDay
  closeTime: TimeOfDay
}
