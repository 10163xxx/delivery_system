import type {
  AuthUserId,
  EntityId,
  IsoDateTime,
  PersonName,
  UserRole,
  Username,
} from '@/objects/domain/DomainObjects'

export type AuthAccount = {
  id: AuthUserId
  username: Username
  role: UserRole
  displayName: PersonName
  linkedProfileId?: EntityId
  createdAt: IsoDateTime
}
