import type { RiderRoleProps } from '@/pages/delivery/app/roleProps'
import type { Rider } from '@/objects/core/SharedObjects'
import type { RiderProfileDraft, RiderProfileErrors } from '@/objects/rider/page/RiderWorkspaceObjects'
import type { Dispatch, SetStateAction } from 'react'

export type RiderProfileWorkspaceProps = Pick<
  RiderRoleProps,
  'BANK_OPTIONS' | 'formatPrice' | 'formatTime' | 'runAction' | 'updateRiderProfile' | 'withdrawRiderIncome'
> & {
  selectedRider: Rider
}

export type RiderProfileAccountSectionProps = Pick<
  RiderProfileWorkspaceProps,
  'BANK_OPTIONS' | 'runAction' | 'selectedRider' | 'updateRiderProfile'
> & {
  profileDraft: RiderProfileDraft
  profileErrors: RiderProfileErrors
  setProfileDraft: Dispatch<SetStateAction<RiderProfileDraft>>
  setProfileErrors: Dispatch<SetStateAction<RiderProfileErrors>>
}
