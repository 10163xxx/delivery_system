import type { Dispatch, SetStateAction } from 'react'
import type { AuthSession, DeliveryAppState } from '@/shared/object'
import type { useDeliveryConsolePageState } from './page-state-service'

export type SessionState = {
  session: AuthSession | null
  state: DeliveryAppState | null
  setError: Dispatch<SetStateAction<string | null>>
  customerStoreSearchHistory: string[]
  setCustomerStoreSearchHistory: Dispatch<SetStateAction<string[]>>
}

export type Params = {
  locationPathname: string
  navigate: (to: string, options?: { replace?: boolean }) => void
  routeOrderId?: string
  searchParams: URLSearchParams
  setSearchParams: (nextInit: URLSearchParams | Record<string, string>) => void
  sessionService: SessionState
  pageState: ReturnType<typeof useDeliveryConsolePageState>
}
