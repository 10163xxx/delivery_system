import type { AdminPropsArgs } from '@/pages/DeliveryConsole/objects/AppBuildRolePropsObjects'
import {
  getAdminActionProps,
  getAdminDraftStateProps,
  getAdminFormattingProps,
  getAdminSetterProps,
  getAdminViewProps,
} from '@/pages/DeliveryConsole/functions/roleProps/AdminRolePropGroups'

export function buildAdminProps({ pageView, pageState, sessionService }: AdminPropsArgs) {
  return {
    ...getAdminViewProps(pageView),
    ...getAdminFormattingProps(pageView),
    ...getAdminDraftStateProps(pageState, sessionService),
    ...getAdminSetterProps(pageState),
    ...getAdminActionProps(),
  }
}
