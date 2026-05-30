import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import { customerRoutes } from '@/pages/customer/routes/CustomerRoutes'
import { merchantRoutes } from '@/pages/merchant/routes/MerchantRoutes'
import DeliveryConsole from '@/pages/delivery/DeliveryConsole'
import { NotFoundPage, RouteErrorPage } from '@/pages/system/RouteErrorPage'

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
