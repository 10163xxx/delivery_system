// Business note: frontend-only UI prop types for shared dialog primitives; do
// not mirror these in backend objects because they describe component wiring.
import type { ComponentProps } from 'react'
import type * as DialogPrimitive from '@radix-ui/react-dialog'

export type DialogContentProps = ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
}
