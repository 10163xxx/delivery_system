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
