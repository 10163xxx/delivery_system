import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
const apiTarget = process.env.VITE_API_TARGET ?? 'http://127.0.0.1:8081'

function getManualChunk(id: string) {
  if (id.includes('/node_modules/')) {
    if (id.includes('/node_modules/react') || id.includes('/node_modules/react-dom')) {
      return 'vendor-react'
    }
    if (id.includes('/node_modules/react-router-dom') || id.includes('/node_modules/@remix-run/')) {
      return 'vendor-router'
    }
    if (id.includes('/node_modules/leaflet')) {
      return 'vendor-map'
    }
    if (id.includes('/node_modules/@radix-ui/') || id.includes('/node_modules/lucide-react')) {
      return 'vendor-ui'
    }
    return 'vendor'
  }

  if (id.includes('/src/pages/CustomerConsole/components/checkout/')) {
    return 'customer-checkout'
  }
  if (id.includes('/src/pages/CustomerConsole/components/profile/')) {
    return 'customer-profile'
  }
  if (id.includes('/src/pages/CustomerConsole/components/store/')) {
    return 'customer-store'
  }
  if (id.includes('/src/pages/CustomerConsole/components/workspace/')) {
    return 'customer-workspace'
  }
  if (id.includes('/src/pages/CustomerConsole/functions/')) return 'customer-functions'
  if (id.includes('/src/pages/CustomerConsole/hooks/')) return 'customer-hooks'
  if (id.includes('/src/pages/CustomerConsole/objects/')) return 'customer-objects'
  if (id.includes('/src/pages/CustomerConsole/')) return 'customer-console'
  if (id.includes('/src/pages/MerchantConsole/')) return 'merchant-console'
  if (id.includes('/src/pages/RiderConsole/')) return 'rider-console'
  if (id.includes('/src/pages/OrderConsole/')) return 'order-console'
  if (id.includes('/src/pages/DeliveryConsole/')) return 'delivery-console'
  return undefined
}

export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      checks: {
        pluginTimings: false,
      },
      output: {
        manualChunks: getManualChunk,
      },
    },
  },
  server: {
    proxy: {
      '/api': apiTarget,
      '/uploads': apiTarget,
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
