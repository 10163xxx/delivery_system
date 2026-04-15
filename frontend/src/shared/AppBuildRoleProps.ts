export { buildAdminProps } from '@/shared/app-build-role-props/AdminRolePropsBuilder'
export { buildCustomerProps } from '@/shared/app-build-role-props/CustomerRolePropsBuilder'
export { buildMerchantProps } from '@/shared/app-build-role-props/MerchantRolePropsBuilder'
export { buildRiderProps } from '@/shared/app-build-role-props/RiderRolePropsBuilder'
export type {
  AdminPropsArgs,
  CustomerPropsArgs,
  MerchantPropsArgs,
  RiderPropsArgs,
} from '@/shared/app-build-role-props/AppBuildRolePropsTypes'
import { buildAdminProps } from '@/shared/app-build-role-props/AdminRolePropsBuilder'
import { buildCustomerProps } from '@/shared/app-build-role-props/CustomerRolePropsBuilder'
import { buildMerchantProps } from '@/shared/app-build-role-props/MerchantRolePropsBuilder'
import { buildRiderProps } from '@/shared/app-build-role-props/RiderRolePropsBuilder'

export type CustomerRoleProps = ReturnType<typeof buildCustomerProps>
export type MerchantRoleProps = ReturnType<typeof buildMerchantProps>
export type RiderRoleProps = ReturnType<typeof buildRiderProps>
export type AdminRoleProps = ReturnType<typeof buildAdminProps>
