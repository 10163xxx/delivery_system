import { Navigate, type RouteObject } from 'react-router-dom'
import DeliveryConsole from '@/pages/delivery/DeliveryConsole'
import { RouteErrorPage } from '@/pages/system/RouteErrorPage'
import { ROUTE_PATH } from '@/objects/core/SharedObjects'

export const merchantRoutes: RouteObject[] = [
  {
    path: ROUTE_PATH.merchantApplication,
    element: <DeliveryConsole />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: ROUTE_PATH.merchantConsole,
    element: <DeliveryConsole />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: ROUTE_PATH.merchantProfile,
    element: <DeliveryConsole />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: ROUTE_PATH.merchantProfileAnalytics,
    element: <DeliveryConsole />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: '/merchant/*',
    element: <Navigate replace to={ROUTE_PATH.merchantConsole} />,
  },
]
