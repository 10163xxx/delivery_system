import { Navigate, type RouteObject } from 'react-router-dom'
import DeliveryConsole from '@/shared/pages/DeliveryConsole'
import { RouteErrorPage } from '@/shared/pages/RouteErrorPage'

export const customerRoutes: RouteObject[] = [
  {
    path: '/customer/order',
    element: <DeliveryConsole />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: '/customer/orders',
    element: <DeliveryConsole />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: '/customer/orders/:orderId',
    element: <DeliveryConsole />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: '/customer/review/:orderId',
    element: <DeliveryConsole />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: '/customer/profile',
    element: <DeliveryConsole />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: '/customer/profile/recharge',
    element: <DeliveryConsole />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: '/customer/profile/coupons',
    element: <DeliveryConsole />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: '/customer/profile/addresses',
    element: <DeliveryConsole />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: '/customer/*',
    element: <Navigate replace to="/customer/order" />,
  },
]
