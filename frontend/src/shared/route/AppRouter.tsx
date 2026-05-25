import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import { customerRoutes } from '@/customer/route/CustomerRoutes'
import { merchantRoutes } from '@/merchant/route/MerchantRoutes'
import DeliveryConsole from '@/shared/pages/delivery/DeliveryConsole'
import { NotFoundPage, RouteErrorPage } from '@/shared/pages/system/RouteErrorPage'

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
