import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from '@/router'

import './index.css'
import './styles/review.css'
import './styles/order-chat.css'
import './styles/delivery-console-shell.css'
import './styles/delivery-console-catalog.css'
import './styles/delivery-console-orders.css'
import './styles/delivery-console-merchant.css'
import './styles/auth.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
