import type { useDeliveryConsolePageState } from '@/pages/DeliveryConsole/hooks/DeliveryConsolePageState'
import type { useDeliveryConsolePageViewService } from '@/pages/DeliveryConsole/hooks/DeliveryConsolePageView'
import type { useDeliveryConsoleSessionService } from '@/pages/AuthScreen/hooks/AuthSessionService'

export type DeliveryConsolePageViewState = ReturnType<typeof useDeliveryConsolePageViewService>
export type DeliveryConsolePageState = ReturnType<typeof useDeliveryConsolePageState>
export type DeliveryConsoleSessionState = ReturnType<typeof useDeliveryConsoleSessionService>
