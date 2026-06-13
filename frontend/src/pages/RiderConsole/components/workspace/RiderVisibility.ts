import type { RiderRoleProps } from '@/pages/DeliveryConsole/functions/roleProps'
import {
  ROLE,
  type EntityId,
  type Rider,
} from '@/objects/core/SharedObjects'
import { asDomainText } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'

export function getVisibleRiders(props: RiderRoleProps): Rider[] {
  const { role, session, state } = props
  if (role === ROLE.rider) {
    const linkedProfileId = session?.user.linkedProfileId
    return state?.riders.filter((rider) => asDomainText<EntityId>(rider.id) === linkedProfileId) ?? []
  }
  return state?.riders ?? []
}
