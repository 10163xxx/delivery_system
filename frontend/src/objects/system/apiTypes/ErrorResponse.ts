// Business note: system protocol DTO shared with backend system APIs; keep field names and value object types aligned.
import type { DisplayText } from '@/objects/system/valueTypes/DisplayText'

export type ErrorResponse = {
  message: DisplayText
}
