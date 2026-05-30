import type { RiderPropsArgs } from '@/objects/page/AppBuildRolePropsObjects'
import {
  getRiderActionProps,
  getRiderSetterProps,
  getRiderStateProps,
  getRiderUtilityProps,
  getRiderViewIdentityProps,
  getRiderViewOrderProps,
} from '@/pages/delivery/app/roleProps/RiderRolePropGroups'

export function buildRiderProps({
  pageView,
  pageState,
  sessionService,
  submitOrderChatMessage,
}: RiderPropsArgs) {
  return {
    ...getRiderUtilityProps(),
    ...getRiderViewIdentityProps(pageView, sessionService),
    ...getRiderViewOrderProps(pageView, pageState),
    ...getRiderStateProps(pageState, sessionService),
    ...getRiderSetterProps(pageState),
    ...getRiderActionProps(submitOrderChatMessage),
  }
}
