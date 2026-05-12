import type { useDeliveryConsolePageState } from '@/shared/app/delivery/DeliveryPageStateService'
import type { useDeliveryConsolePageViewService } from '@/shared/app/delivery/DeliveryPageViewService'
import type { useDeliveryConsoleSessionService } from '@/shared/app/delivery/DeliverySessionService'

export type DeliveryConsolePageViewState = ReturnType<typeof useDeliveryConsolePageViewService>
export type DeliveryConsolePageState = ReturnType<typeof useDeliveryConsolePageState>
export type DeliveryConsoleSessionState = ReturnType<typeof useDeliveryConsoleSessionService>
