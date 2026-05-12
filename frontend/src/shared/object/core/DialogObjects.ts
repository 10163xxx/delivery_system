import type { ComponentProps } from 'react'
import type * as DialogPrimitive from '@radix-ui/react-dialog'

export type DialogContentProps = ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
}
