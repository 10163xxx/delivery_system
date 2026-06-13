import type { AdminRoleProps, CustomerRoleProps, MerchantRoleProps, RiderRoleProps } from '@/pages/DeliveryConsole/functions/roleProps'
import type { AuthSession, DeliveryAppState, Role } from '@/objects/core/SharedObjects'

export type AuthScreenProps = {
  onAuthenticated: (session: AuthSession) => void
}

export type ErrorContent = {
  status: number
  title: string
  detail: string
}

export type RouteStatusCardProps = ErrorContent & {
  pathname: string
}

export type CustomerWorkspaceHeaderTab = {
  readonly route: string
  readonly label: string
}

export type CustomerWorkspaceViewMeta = {
  readonly title: string
  readonly activeTab: keyof typeof import('@/pages/DeliveryConsole/components/primitives/DeliveryConsoleCopy').CUSTOMER_WORKSPACE_HEADER_TABS
}

export type DisplayImageSlotProps = {
  alt: string
  label: string
  src?: string
  className?: string
}

type DeliveryConsoleStageSessionProps = {
  role: Role
  state: DeliveryAppState | null
  error: string | null
  busy: boolean
  currentDisplayName: string
}

type DeliveryConsoleStageActionProps = {
  isRefreshing: boolean
  isLoggingOut: boolean
  loadState: () => Promise<void>
  logout: () => Promise<void>
  roleLabels: Record<Role, string>
  showLogoutModal: boolean
}

type DeliveryConsoleStageRoleProps = {
  customerProps: CustomerRoleProps
  merchantProps: MerchantRoleProps
  riderProps: RiderRoleProps
  adminProps: AdminRoleProps
}

export type DeliveryConsoleStageProps = DeliveryConsoleStageSessionProps &
  DeliveryConsoleStageActionProps &
  DeliveryConsoleStageRoleProps
