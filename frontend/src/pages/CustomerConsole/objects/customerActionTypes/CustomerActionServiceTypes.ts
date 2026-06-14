import type { DeliveryAppState } from '@/objects/core/SharedObjects'

export type RunAction = (action: () => Promise<DeliveryAppState>) => Promise<boolean>

export type CustomerActionServices = {
  runAction: RunAction
  navigate: (to: string, options?: { replace?: boolean }) => void
}
