// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
import type {
  AuthUserId,
  EntityId,
  IsoDateTime,
  PasswordHash,
  PersonName,
  UserRole,
  Username,
} from '@/objects/core/SharedObjects'

export type PersistedAuthAccount = {
  id: AuthUserId
  username: Username
  passwordHash: PasswordHash
  role: UserRole
  displayName: PersonName
  linkedProfileId?: EntityId
  createdAt: IsoDateTime
}
