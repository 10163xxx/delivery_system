import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import { customerRoutes } from '@/pages/router/CustomerRoutes'
import { merchantRoutes } from '@/pages/router/MerchantRoutes'
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
