package domain.shared

enum OrderTimelineMessage:
  case OrderPlaced(scheduledDeliveryAt: IsoDateTime, couponTitle: Option[DisplayText], couponDiscountCents: CurrencyCents)
  case MerchantRejected(reason: ReasonText)
  case RiderAssigned(riderName: PersonName)
  case CustomerReviewSubmitted(labels: List[DisplayText])
  case ReviewRevoked(reason: ReasonText)
  case AfterSalesSubmitted
  case PartialRefundRequested(itemName: DisplayText, quantity: Quantity, reason: ReasonText)
  case PartialRefundApproved(itemName: DisplayText, quantity: Quantity, refundAmountCents: CurrencyCents, resolutionNote: ResolutionText)
  case PartialRefundRejected(itemName: DisplayText, quantity: Quantity, resolutionNote: ResolutionText)

enum AfterSalesOutcomeMessage:
  case Rejected(resolutionNote: ResolutionText)
  case ReturnToBalance(amountCents: CurrencyCents, resolutionNote: ResolutionText)
  case CompensationToBalance(amountCents: CurrencyCents, resolutionNote: ResolutionText)
  case CouponIssued(couponTitle: DisplayText, discountCents: CurrencyCents, resolutionNote: ResolutionText)
  case ManualApproved(resolutionNote: ResolutionText)

enum AfterSalesTicketSummaryMessage:
  case ReturnRequest(reason: ReasonText)
  case CompensationRequest(reason: ReasonText, expectedCompensationCents: Option[CurrencyCents])

enum ReviewTicketSummaryMessage:
  case Positive(customerName: PersonName, storeName: DisplayText, detail: DisplayText)
  case Negative(customerName: PersonName, detail: DisplayText)
  case DeliveryIssue(customerName: PersonName, detail: DisplayText)
