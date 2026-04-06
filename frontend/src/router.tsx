import { createBrowserRouter, Navigate } from 'react-router-dom'
import DeliveryConsole from '@/pages/DeliveryConsole'
import { NotFoundPage, RouteErrorPage } from '@/pages/RouteErrorPage'

const routes = [
  {
    path: '/',
    element: <DeliveryConsole />,
    errorElement: <RouteErrorPage />,
  },
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
  {
    path: '*',
    element: <NotFoundPage />,
  },
]

export const router = createBrowserRouter(routes)
