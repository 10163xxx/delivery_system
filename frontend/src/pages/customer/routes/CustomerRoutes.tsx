import { Navigate, type RouteObject } from 'react-router-dom'
import DeliveryConsole from '@/pages/delivery/DeliveryConsole'
import { RouteErrorPage } from '@/pages/system/RouteErrorPage'
import { ROUTE_PATH } from '@/objects/core/SharedObjects'

export const customerRoutes: RouteObject[] = [
  {
    path: ROUTE_PATH.customerOrder,
    element: <DeliveryConsole />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: ROUTE_PATH.customerCart,
    element: <DeliveryConsole />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: ROUTE_PATH.customerOrders,
    element: <DeliveryConsole />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: `${ROUTE_PATH.customerOrders}/:orderId`,
    element: <DeliveryConsole />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: `${ROUTE_PATH.customerReviewPrefix}:orderId`,
    element: <DeliveryConsole />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: ROUTE_PATH.customerProfile,
    element: <DeliveryConsole />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: ROUTE_PATH.customerProfileRecharge,
    element: <DeliveryConsole />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: ROUTE_PATH.customerProfileCoupons,
    element: <DeliveryConsole />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: ROUTE_PATH.customerProfileAddresses,
    element: <DeliveryConsole />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: ROUTE_PATH.customerProfileRefunds,
    element: <DeliveryConsole />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: ROUTE_PATH.customerProfileFavorites,
    element: <DeliveryConsole />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: ROUTE_PATH.customerProfileBlockedStores,
    element: <DeliveryConsole />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: '/customer/*',
    element: <Navigate replace to={ROUTE_PATH.customerOrder} />,
  },
]
