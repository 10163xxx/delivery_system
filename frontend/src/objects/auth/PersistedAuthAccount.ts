import type {
  AuthUserId,
  EntityId,
  IsoDateTime,
  PasswordHash,
  PersonName,
  UserRole,
  Username,
} from '@/objects/domain/DomainObjects'

export type PersistedAuthAccount = {
  id: AuthUserId
  username: Username
  passwordHash: PasswordHash
  role: UserRole
  displayName: PersonName
  linkedProfileId?: EntityId
  createdAt: IsoDateTime
}
