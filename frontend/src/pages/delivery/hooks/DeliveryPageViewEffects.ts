import type { DeliveryPageViewEffectsArgs } from '@/objects/page/DeliveryPageObjects'
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
