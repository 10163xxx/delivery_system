// Application bootstrap: attach the router and shared style bundles once at startup.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from '@/router'

import './pages/DeliveryConsole/styles/SharedStyles.css'
import './pages/DeliveryConsole/styles/review.css'
import './pages/DeliveryConsole/styles/orderChat.css'
import './pages/DeliveryConsole/styles/deliveryConsoleShell.css'
import './pages/DeliveryConsole/styles/deliveryConsoleCatalog.css'
import './pages/DeliveryConsole/styles/deliveryConsoleOrders.css'
import './pages/DeliveryConsole/styles/deliveryConsoleMerchant.css'
import './pages/DeliveryConsole/styles/auth.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
