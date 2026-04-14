export { buildAdminProps } from '@/shared/app-build-role-props/admin'
export { buildCustomerProps } from '@/shared/app-build-role-props/customer'
export { buildMerchantProps } from '@/shared/app-build-role-props/merchant'
export { buildRiderProps } from '@/shared/app-build-role-props/rider'
export type {
  AdminPropsArgs,
  CustomerPropsArgs,
  MerchantPropsArgs,
  RiderPropsArgs,
} from '@/shared/app-build-role-props/types'
import { buildAdminProps } from '@/shared/app-build-role-props/admin'
import { buildCustomerProps } from '@/shared/app-build-role-props/customer'
import { buildMerchantProps } from '@/shared/app-build-role-props/merchant'
import { buildRiderProps } from '@/shared/app-build-role-props/rider'

export type CustomerRoleProps = ReturnType<typeof buildCustomerProps>
export type MerchantRoleProps = ReturnType<typeof buildMerchantProps>
export type RiderRoleProps = ReturnType<typeof buildRiderProps>
export type AdminRoleProps = ReturnType<typeof buildAdminProps>
