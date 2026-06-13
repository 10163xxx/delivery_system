import { useState } from 'react'
import type {
  DisplayText,
  EligibilityReviewId,
  MerchantApplicationId,
  OrderId,
  RefundRequestId,
  ResolveTicketRequest,
  ReviewAppealId,
  TicketId,
} from '@/objects/core/SharedObjects'
import type {
  AfterSalesDraft,
  AfterSalesResolutionDraft,
  AppealResolutionDraft,
  PartialRefundDraft,
  PartialRefundDraftKey,
  ReviewDraft,
  ReviewDraftKey,
} from '@/pages/DeliveryConsole/objects/DeliveryDraftObjects'

export function useReviewAndTicketState() {
  const [orderChatDrafts, setOrderChatDrafts] = useState<Record<OrderId, DisplayText>>({})
  const [orderChatErrors, setOrderChatErrors] = useState<Record<OrderId, DisplayText>>({})
  const [reviewDrafts, setReviewDrafts] = useState<Record<ReviewDraftKey, ReviewDraft>>({})
  const [reviewErrors, setReviewErrors] = useState<Record<ReviewDraftKey, DisplayText>>({})
  const [partialRefundDrafts, setPartialRefundDrafts] = useState<Record<PartialRefundDraftKey, PartialRefundDraft>>({})
  const [partialRefundErrors, setPartialRefundErrors] = useState<Record<PartialRefundDraftKey, DisplayText>>({})
  const [afterSalesDrafts, setAfterSalesDrafts] = useState<Record<OrderId, AfterSalesDraft>>({})
  const [afterSalesErrors, setAfterSalesErrors] = useState<Record<OrderId, DisplayText>>({})
  const [partialRefundResolutionDrafts, setPartialRefundResolutionDrafts] = useState<Record<RefundRequestId, DisplayText>>({})
  const [applicationReviewDrafts, setApplicationReviewDrafts] = useState<Record<MerchantApplicationId, DisplayText>>({})
  const [afterSalesResolutionDrafts, setAfterSalesResolutionDrafts] = useState<Record<TicketId, AfterSalesResolutionDraft>>({})
  const [resolutionDrafts, setResolutionDrafts] = useState<Record<OrderId, ResolveTicketRequest>>({})
  const [riderAppealDrafts, setRiderAppealDrafts] = useState<Record<OrderId, DisplayText>>({})
  const [appealResolutionDrafts, setAppealResolutionDrafts] = useState<Record<ReviewAppealId, AppealResolutionDraft>>({})
  const [eligibilityResolutionDrafts, setEligibilityResolutionDrafts] = useState<Record<EligibilityReviewId, AppealResolutionDraft>>({})

  return {
    orderChatDrafts,
    setOrderChatDrafts,
    orderChatErrors,
    setOrderChatErrors,
    reviewDrafts,
    setReviewDrafts,
    reviewErrors,
    setReviewErrors,
    partialRefundDrafts,
    setPartialRefundDrafts,
    partialRefundErrors,
    setPartialRefundErrors,
    afterSalesDrafts,
    setAfterSalesDrafts,
    afterSalesErrors,
    setAfterSalesErrors,
    partialRefundResolutionDrafts,
    setPartialRefundResolutionDrafts,
    applicationReviewDrafts,
    setApplicationReviewDrafts,
    afterSalesResolutionDrafts,
    setAfterSalesResolutionDrafts,
    resolutionDrafts,
    setResolutionDrafts,
    riderAppealDrafts,
    setRiderAppealDrafts,
    appealResolutionDrafts,
    setAppealResolutionDrafts,
    eligibilityResolutionDrafts,
    setEligibilityResolutionDrafts,
  }
}
