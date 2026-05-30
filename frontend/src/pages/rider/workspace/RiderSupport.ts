import type { RiderRoleProps } from '@/pages/delivery/app/roleProps'
import {
  ROLE,
  type Rider,
} from '@/objects/core/SharedObjects'

export function getVisibleRiders(props: RiderRoleProps): Rider[] {
  const { role, session, state } = props
  if (role === ROLE.rider) {
    return state?.riders.filter((rider) => rider.id === session?.user.linkedProfileId) ?? []
  }
  return state?.riders ?? []
}
