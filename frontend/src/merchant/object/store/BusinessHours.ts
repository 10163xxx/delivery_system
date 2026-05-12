import type { TimeOfDay } from '@/shared/object/domain/DomainObjects'

export type BusinessHours = {
  openTime: TimeOfDay
  closeTime: TimeOfDay
}
