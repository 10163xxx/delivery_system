import type { RiderPropsArgs } from '@/pages/DeliveryConsole/objects/AppBuildRolePropsObjects'
import {
  getRiderActionProps,
  getRiderSetterProps,
  getRiderStateProps,
  getRiderUtilityProps,
  getRiderViewIdentityProps,
  getRiderViewOrderProps,
} from '@/pages/DeliveryConsole/functions/roleProps/RiderRolePropGroups'

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
