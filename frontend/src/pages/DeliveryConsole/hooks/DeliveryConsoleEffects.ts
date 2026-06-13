import type { DeliveryPageViewEffectsArgs } from '@/pages/DeliveryConsole/objects/DeliveryPageObjects'
import {
  useDeliveryConsoleGuardEffects,
  useDeliveryConsoleSyncEffects,
} from '@/pages/DeliveryConsole/hooks/DeliveryConsoleEffectGroups'

export function useDeliveryConsolePageViewEffects(
  args: DeliveryPageViewEffectsArgs,
) {
  useDeliveryConsoleSyncEffects(args)
  useDeliveryConsoleGuardEffects(args)
}
