import type { AdminPropsArgs } from '@/shared/object/core/AppBuildRolePropsObjects'
import {
  getAdminActionProps,
  getAdminDraftStateProps,
  getAdminFormattingProps,
  getAdminSetterProps,
  getAdminViewProps,
} from '@/shared/app/role-props/AdminRolePropGroups'

export function buildAdminProps({ pageView, pageState, sessionService }: AdminPropsArgs) {
  return {
    ...getAdminViewProps(pageView),
    ...getAdminFormattingProps(pageView),
    ...getAdminDraftStateProps(pageState, sessionService),
    ...getAdminSetterProps(pageState),
    ...getAdminActionProps(),
  }
}
