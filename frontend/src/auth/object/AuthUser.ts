import type {
  AuthUserId,
  EntityId,
  PersonName,
  Role,
  Username,
} from '@/shared/object/domain/DomainObjects'

export type AuthUser = {
  id: AuthUserId
  username: Username
  role: Role
  displayName: PersonName
  linkedProfileId?: EntityId
}
