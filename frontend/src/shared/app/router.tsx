import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import { customerRoutes } from '@/customer/route'
import { merchantRoutes } from '@/merchant/route'
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
