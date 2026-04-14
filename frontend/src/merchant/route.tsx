import { Navigate, type RouteObject } from 'react-router-dom'
import DeliveryConsole from '@/shared/pages/DeliveryConsole'
import { RouteErrorPage } from '@/shared/pages/RouteErrorPage'

export const merchantRoutes: RouteObject[] = [
  {
    path: '/merchant/application',
    element: <DeliveryConsole />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: '/merchant/console',
    element: <DeliveryConsole />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: '/merchant/profile',
    element: <DeliveryConsole />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: '/merchant/*',
    element: <Navigate replace to="/merchant/console" />,
  },
]
