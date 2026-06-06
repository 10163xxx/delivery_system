// Application bootstrap: attach the router and shared style bundles once at startup.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from '@/router'

import './styles/SharedStyles.css'
import './styles/review.css'
import './styles/orderChat.css'
import './styles/deliveryConsoleShell.css'
import './styles/deliveryConsoleCatalog.css'
import './styles/deliveryConsoleOrders.css'
import './styles/deliveryConsoleMerchant.css'
import './styles/auth.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
