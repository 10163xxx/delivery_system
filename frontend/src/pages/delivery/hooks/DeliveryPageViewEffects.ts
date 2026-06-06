import type { DeliveryPageViewEffectsArgs } from '@/pages/delivery/objects/DeliveryPageObjects'
import {
  useDeliveryConsoleGuardEffects,
  useDeliveryConsoleSyncEffects,
} from './DeliveryPageViewEffectHooks'

export function useDeliveryConsolePageViewEffects(
  args: DeliveryPageViewEffectsArgs,
) {
  useDeliveryConsoleSyncEffects(args)
  useDeliveryConsoleGuardEffects(args)
}
