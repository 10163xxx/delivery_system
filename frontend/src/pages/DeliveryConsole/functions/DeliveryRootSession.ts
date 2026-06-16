import type { NavigateFunction } from 'react-router-dom'
import type { AuthSession } from '@/objects/core/SharedObjects'
import { getDefaultRouteForSession } from '@/pages/DeliveryConsole/functions/DeliveryScreenAssembly'

export function handleDeliveryRootAuthenticated(args: {
  navigate: NavigateFunction
  resetPageState: () => void
  session: AuthSession
  setSession: (session: AuthSession) => void
}) {
  const { navigate, resetPageState, session, setSession } = args

  resetPageState()
  navigate(getDefaultRouteForSession(session), { replace: true })
  setSession(session)
}
