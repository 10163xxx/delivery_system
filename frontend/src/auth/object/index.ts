import type {
  AuthUserId,
  EntityId,
  Password,
  PersonName,
  Role,
  SessionToken,
  Username,
} from '@/shared/object/domain'
export type AuthUser = {
  id: AuthUserId
  username: Username
  role: Role
  displayName: PersonName
  linkedProfileId?: EntityId
}

export type AuthSession = {
  token: SessionToken
  user: AuthUser
}

export type LoginRequest = {
  username: Username
  password: Password
  role: Role
}

export type RegisterRequest = {
  username: Username
  password: Password
  role: Exclude<Role, 'admin'>
}
