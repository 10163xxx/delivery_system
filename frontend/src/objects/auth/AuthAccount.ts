import type {
  AuthUserId,
  EntityId,
  IsoDateTime,
  PersonName,
  UserRole,
  Username,
} from '@/objects/core/SharedObjects'

export type AuthAccount = {
  id: AuthUserId
  username: Username
  role: UserRole
  displayName: PersonName
  linkedProfileId?: EntityId
  createdAt: IsoDateTime
}
