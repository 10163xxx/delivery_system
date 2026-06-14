import type { CustomerActionParams } from '@/pages/CustomerConsole/objects/CustomerActionTypes'
import type { buildReviewPayload } from '@/pages/DeliveryConsole/functions/payloads/DeliveryPayloadCustomer'

export type CustomerOrderIssueParams = Pick<
  CustomerActionParams,
  | 'state'
  | 'partialRefundDrafts'
  | 'afterSalesDrafts'
  | 'reviewDrafts'
  | 'runAction'
  | 'navigate'
  | 'setPartialRefundErrors'
  | 'setPartialRefundDrafts'
  | 'setAfterSalesErrors'
  | 'setAfterSalesDrafts'
  | 'setReviewErrors'
  | 'setReviewDrafts'
>

export type ReviewSubmissionValidationResult =
  | { ok: true; payload: ReturnType<typeof buildReviewPayload> }
  | { ok: false }
