import type { RiderRoleProps } from '@/shared/app/role-props'
import {
  ROLE,
  type Rider,
} from '@/shared/object/core/SharedObjects'

export function getVisibleRiders(props: RiderRoleProps): Rider[] {
  const { role, session, state } = props
  if (role === ROLE.rider) {
    return state?.riders.filter((rider) => rider.id === session?.user.linkedProfileId) ?? []
  }
  return state?.riders ?? []
}
