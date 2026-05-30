import type { AdminPropsArgs } from '@/objects/page/AppBuildRolePropsObjects'
import {
  getAdminActionProps,
  getAdminDraftStateProps,
  getAdminFormattingProps,
  getAdminSetterProps,
  getAdminViewProps,
} from '@/pages/delivery/app/roleProps/AdminRolePropGroups'

export function buildAdminProps({ pageView, pageState, sessionService }: AdminPropsArgs) {
  return {
    ...getAdminViewProps(pageView),
    ...getAdminFormattingProps(pageView),
    ...getAdminDraftStateProps(pageState, sessionService),
    ...getAdminSetterProps(pageState),
    ...getAdminActionProps(),
  }
}
