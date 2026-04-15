import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import { customerRoutes } from '@/customer/CustomerRoutes'
import { merchantRoutes } from '@/merchant/MerchantRoutes'
import DeliveryConsole from '@/shared/pages/DeliveryConsole'
import { NotFoundPage, RouteErrorPage } from '@/shared/pages/RouteErrorPage'

const routes: RouteObject[] = [
  {
    path: '/',
    element: <DeliveryConsole />,
    errorElement: <RouteErrorPage />,
  },
  ...customerRoutes,
  ...merchantRoutes,
  {
    path: '*',
    element: <NotFoundPage />,
  },
]

export const router = createBrowserRouter(routes)
