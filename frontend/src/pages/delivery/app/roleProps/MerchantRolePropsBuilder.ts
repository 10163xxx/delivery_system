import type { MerchantPropsArgs } from '@/pages/delivery/objects/AppBuildRolePropsObjects'
import {
  getMerchantActionProps,
  getMerchantApiActionProps,
  getMerchantDraftSetters,
  getMerchantDraftStateProps,
  getMerchantOrderIssueSetters,
  getMerchantOrderIssueStateProps,
  getMerchantUtilityFieldProps,
  getMerchantViewIdentityProps,
  getMerchantViewStoreProps,
  getMerchantViewWorkspaceProps,
} from '@/pages/delivery/app/roleProps/MerchantRolePropGroups'

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
    ...getMerchantOrderIssueStateProps(pageState, sessionService),
    ...getMerchantDraftSetters(pageState),
    ...getMerchantOrderIssueSetters(pageState),
    ...getMerchantActionProps(merchantActionArgs),
    ...getMerchantApiActionProps(submitOrderChatMessage),
  }
}
