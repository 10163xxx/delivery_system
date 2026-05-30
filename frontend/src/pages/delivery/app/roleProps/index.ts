export { buildAdminProps } from '@/pages/delivery/app/roleProps/AdminRolePropsBuilder'
export { buildCustomerProps } from '@/pages/delivery/app/roleProps/CustomerRolePropsBuilder'
export { buildMerchantProps } from '@/pages/delivery/app/roleProps/MerchantRolePropsBuilder'
export { buildRiderProps } from '@/pages/delivery/app/roleProps/RiderRolePropsBuilder'
export type {
  AdminPropsArgs,
  CustomerPropsArgs,
  MerchantPropsArgs,
  RiderPropsArgs,
} from '@/objects/page/AppBuildRolePropsObjects'
import { buildAdminProps } from '@/pages/delivery/app/roleProps/AdminRolePropsBuilder'
import { buildCustomerProps } from '@/pages/delivery/app/roleProps/CustomerRolePropsBuilder'
import { buildMerchantProps } from '@/pages/delivery/app/roleProps/MerchantRolePropsBuilder'
import { buildRiderProps } from '@/pages/delivery/app/roleProps/RiderRolePropsBuilder'

export type CustomerRoleProps = ReturnType<typeof buildCustomerProps>
export type MerchantRoleProps = ReturnType<typeof buildMerchantProps>
export type RiderRoleProps = ReturnType<typeof buildRiderProps>
export type AdminRoleProps = ReturnType<typeof buildAdminProps>
