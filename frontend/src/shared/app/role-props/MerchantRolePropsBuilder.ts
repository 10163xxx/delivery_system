import type { MerchantPropsArgs } from '@/shared/object/core/AppBuildRolePropsObjects'
import {
  getMerchantActionProps,
  getMerchantApiActionProps,
  getMerchantDraftSetters,
  getMerchantDraftStateProps,
  getMerchantSupportSetters,
  getMerchantSupportStateProps,
  getMerchantUtilityFieldProps,
  getMerchantViewIdentityProps,
  getMerchantViewStoreProps,
  getMerchantViewWorkspaceProps,
} from '@/shared/app/role-props/MerchantRolePropGroups'

export function buildMerchantProps({
  pageView,
  pageState,
  sessionService,
  navigate,
  submitOrderChatMessage,
  ...merchantActionArgs
}: MerchantPropsArgs) {
  return {
    ...getMerchantUtilityFieldProps(),
    ...getMerchantViewIdentityProps(pageView, navigate),
    ...getMerchantViewWorkspaceProps(pageView),
    ...getMerchantViewStoreProps(pageView),
    ...getMerchantDraftStateProps(pageState),
    ...getMerchantSupportStateProps(pageState, sessionService),
    ...getMerchantDraftSetters(pageState),
    ...getMerchantSupportSetters(pageState),
    ...getMerchantActionProps(merchantActionArgs),
    ...getMerchantApiActionProps(submitOrderChatMessage),
  }
}
