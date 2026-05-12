import type { RiderPropsArgs } from '@/shared/object/core/AppBuildRolePropsObjects'
import {
  getRiderActionProps,
  getRiderSetterProps,
  getRiderStateProps,
  getRiderUtilityProps,
  getRiderViewIdentityProps,
  getRiderViewOrderProps,
} from '@/shared/app/role-props/RiderRolePropGroups'

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
