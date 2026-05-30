import type { MerchantPropsArgs } from '@/objects/page/AppBuildRolePropsObjects'
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
    ...getMerchantSupportStateProps(pageState, sessionService),
    ...getMerchantDraftSetters(pageState),
    ...getMerchantSupportSetters(pageState),
    ...getMerchantActionProps(merchantActionArgs),
    ...getMerchantApiActionProps(submitOrderChatMessage),
  }
}
