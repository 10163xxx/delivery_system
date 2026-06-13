// Top-level route table for the delivery console and role-specific pages.
import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import { customerRoutes } from '@/pages/CustomerConsole/functions/CustomerRoutes'
import { merchantRoutes } from '@/pages/MerchantConsole/functions/MerchantRoutes'
import DeliveryConsole from '@/pages/DeliveryConsole'
import { NotFoundPage, RouteErrorPage } from '@/pages/SystemPages/RouteErrorPage'

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
