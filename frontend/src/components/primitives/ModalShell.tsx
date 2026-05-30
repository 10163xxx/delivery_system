import { Dialog, DialogContent } from '@/components/ui/dialog'
import type { ModalShellProps } from '@/objects/core/SharedViewObjects'

export function ModalShell({ children, isOpen = true, onClose }: ModalShellProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="w-[min(92vw,32rem)] rounded-xl border bg-card p-6 shadow-lg"
        showCloseButton={false}
      >
        {children}
      </DialogContent>
    </Dialog>
  )
}
