import type { useDeliveryConsolePageState } from '@/pages/delivery/hooks/DeliveryPageStateService'
import type { useDeliveryConsolePageViewService } from '@/pages/delivery/hooks/DeliveryPageViewService'
import type { useDeliveryConsoleSessionService } from '@/pages/delivery/hooks/DeliverySessionService'

export type DeliveryConsolePageViewState = ReturnType<typeof useDeliveryConsolePageViewService>
export type DeliveryConsolePageState = ReturnType<typeof useDeliveryConsolePageState>
export type DeliveryConsoleSessionState = ReturnType<typeof useDeliveryConsoleSessionService>
