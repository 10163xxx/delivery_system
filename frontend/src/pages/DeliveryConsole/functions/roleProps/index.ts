export { buildAdminProps } from '@/pages/DeliveryConsole/functions/roleProps/AdminRolePropsBuilder'
export { buildCustomerProps } from '@/pages/DeliveryConsole/functions/roleProps/CustomerRolePropsBuilder'
export { buildMerchantProps } from '@/pages/DeliveryConsole/functions/roleProps/MerchantRolePropsBuilder'
export { buildRiderProps } from '@/pages/DeliveryConsole/functions/roleProps/RiderRolePropsBuilder'
export type {
  AdminPropsArgs,
  CustomerPropsArgs,
  MerchantPropsArgs,
  RiderPropsArgs,
} from '@/pages/DeliveryConsole/objects/AppBuildRolePropsObjects'
import { buildAdminProps } from '@/pages/DeliveryConsole/functions/roleProps/AdminRolePropsBuilder'
import { buildCustomerProps } from '@/pages/DeliveryConsole/functions/roleProps/CustomerRolePropsBuilder'
import { buildMerchantProps } from '@/pages/DeliveryConsole/functions/roleProps/MerchantRolePropsBuilder'
import { buildRiderProps } from '@/pages/DeliveryConsole/functions/roleProps/RiderRolePropsBuilder'

export type CustomerRoleProps = ReturnType<typeof buildCustomerProps>
export type MerchantRoleProps = ReturnType<typeof buildMerchantProps>
export type RiderRoleProps = ReturnType<typeof buildRiderProps>
export type AdminRoleProps = ReturnType<typeof buildAdminProps>
