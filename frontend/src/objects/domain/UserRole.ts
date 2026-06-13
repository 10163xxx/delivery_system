export const ROLE = {
  customer: 'customer',
  merchant: 'merchant',
  rider: 'rider',
  admin: 'admin',
} as const

export const REGISTERABLE_ROLES = [ROLE.customer, ROLE.merchant, ROLE.rider] as const

export type Role = (typeof ROLE)[keyof typeof ROLE]
export type UserRole = Role
