// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
import type {
  AdminId,
  AuthUserId,
  CustomerId,
  IsoDateTime,
  MerchantId,
  PersonName,
  RiderId,
  UserRole,
  Username,
} from '@/objects/core/SharedObjects'
import { ROLE } from '@/objects/core/SharedObjects'

type BaseAuthAccount = {
  id: AuthUserId
  username: Username
  displayName: PersonName
  createdAt: IsoDateTime
}

export type CustomerAuthAccount = BaseAuthAccount & {
  role: typeof ROLE.customer
  linkedProfileId: CustomerId
}

export type MerchantAuthAccount = BaseAuthAccount & {
  role: typeof ROLE.merchant
  linkedProfileId?: MerchantId
}

export type RiderAuthAccount = BaseAuthAccount & {
  role: typeof ROLE.rider
  linkedProfileId: RiderId
}

export type AdminAuthAccount = BaseAuthAccount & {
  role: typeof ROLE.admin
  linkedProfileId?: AdminId
}

export type AuthAccount =
  | CustomerAuthAccount
  | MerchantAuthAccount
  | RiderAuthAccount
  | AdminAuthAccount

export type AuthAccountRole = UserRole
