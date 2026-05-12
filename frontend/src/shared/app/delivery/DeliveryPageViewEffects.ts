import type { DeliveryPageViewEffectsArgs } from '@/shared/object/core/DeliveryPageObjects'
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
