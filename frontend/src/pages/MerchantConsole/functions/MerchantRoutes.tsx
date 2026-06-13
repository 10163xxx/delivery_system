import { Navigate, type RouteObject } from 'react-router-dom'
import DeliveryConsole from '@/pages/DeliveryConsole'
import { RouteErrorPage } from '@/pages/SystemPages/RouteErrorPage'
import { ROUTE_PATH } from '@/objects/core/SharedObjects'

export const merchantRoutes: RouteObject[] = [
  {
    path: ROUTE_PATH.merchantApplication,
    element: <DeliveryConsole />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: ROUTE_PATH.merchantStore,
    element: <DeliveryConsole />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: ROUTE_PATH.merchantOrders,
    element: <DeliveryConsole />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: ROUTE_PATH.merchantConsole,
    element: <Navigate replace to={ROUTE_PATH.merchantStore} />,
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
    element: <Navigate replace to={ROUTE_PATH.merchantStore} />,
  },
]
