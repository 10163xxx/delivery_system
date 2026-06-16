import type { MerchantPropsArgs } from '@/pages/DeliveryConsole/objects/AppBuildRolePropsObjects'
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
} from '@/pages/MerchantConsole/functions/roleProps/MerchantRolePropGroups'

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
