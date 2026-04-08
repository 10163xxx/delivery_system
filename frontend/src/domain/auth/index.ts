import type {
  AuthUserId,
  DisplayText,
  EntityId,
  Password,
  Role,
  SessionToken,
  Username,
} from '../shared'
export type AuthUser = {
  id: AuthUserId
  username: Username
  role: Role
  displayName: DisplayText
  linkedProfileId?: EntityId
}

export type AuthSession = {
  token: SessionToken
  user: AuthUser
}

export type LoginRequest = {
  username: Username
  password: Password
}

export type RegisterRequest = {
  username: Username
  password: Password
  role: Exclude<Role, 'admin'>
}
