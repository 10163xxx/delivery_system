import type { DisplayText } from '@/objects/core/SharedObjects'
import { createInitialReviewDraft } from '@/pages/DeliveryConsole/functions/drafts/DeliveryDrafts'
import type { ReviewDraft } from '@/pages/DeliveryConsole/objects/DeliveryDraftObjects'
import type { ActionArgs } from '@/pages/DeliveryConsole/objects/DeliveryPageActionTypes'

export function updateReviewDraftAction(
  args: ActionArgs,
  orderId: string,
  patch: Partial<ReviewDraft>,
) {
  args.setReviewDrafts((current: Record<string, ReviewDraft>) => ({
    ...current,
    [orderId]: {
      ...(current[orderId] ?? createInitialReviewDraft()),
      ...patch,
    },
  }))
  args.setReviewErrors((current: Record<string, DisplayText>) => {
    if (!current[orderId]) return current
    const next = { ...current }
    delete next[orderId]
    return next
  })
}
