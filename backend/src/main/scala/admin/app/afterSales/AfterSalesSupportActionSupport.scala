package admin.app

import domain.shared.given

import domain.admin.*
import domain.customer.*
import domain.order.*
import domain.shared.*
import shared.app.*

import java.time.Instant

val afterSalesCouponDescription = wrapText[DescriptionText]("管理员处理售后申请后补发，可在有效期内下单抵扣")
val afterSalesReturnCouponTitle = wrapText[DisplayText]("售后退货补偿券")
val afterSalesCompensationCouponTitle = wrapText[DisplayText]("售后补偿券")

def findAfterSalesTicket(
    current: DeliveryAppState,
    ticketId: TicketId,
): Either[ErrorMessage, AdminTicket] =
  current.tickets.find(_.id == ticketId).toRight(ValidationMessages.AfterSales.AfterSalesTicketNotFound)

def requireAfterSalesTicket(ticket: AdminTicket): Either[ErrorMessage, Unit] =
  Either.cond(ticket.kind == TicketKind.DeliveryIssue, (), ValidationMessages.AfterSales.TicketIsNotAfterSalesRequest)

def requireOpenAfterSalesTicket(ticket: AdminTicket): Either[ErrorMessage, Unit] =
  Either.cond(ticket.status == TicketStatus.Open, (), ValidationMessages.AfterSales.AfterSalesAlreadyResolved)

def findAfterSalesOrder(
    current: DeliveryAppState,
    orderId: OrderId,
): Either[ErrorMessage, OrderSummary] =
  current.orders.find(_.id == orderId).toRight(ValidationMessages.Order.OrderNotFound)

def findAfterSalesOrderByTicket(
    current: DeliveryAppState,
    ticket: AdminTicket,
): Either[ErrorMessage, OrderSummary] =
  current.orders.find(_.id == ticket.orderId).toRight(ValidationMessages.AfterSales.RelatedOrderNotFound)

def findRelatedCustomer(
    current: DeliveryAppState,
    order: OrderSummary,
): Either[ErrorMessage, Customer] =
  current.customers.find(_.id == order.customerId).toRight(ValidationMessages.AfterSales.RelatedCustomerNotFound)

def sanitizeSupportResolutionNote(value: ResolutionText): Either[ErrorMessage, ResolutionText] =
  sanitizeRequiredText(
    value,
    DeliveryValidationDefaults.OrderReasonMaxLength,
    ValidationMessages.AfterSales.ResolutionNoteRequired,
  )

def hasPendingAfterSalesTicket(
    current: DeliveryAppState,
    orderId: OrderId,
): ApprovalFlag =
  current.tickets.exists(ticket =>
    ticket.orderId == orderId &&
      ticket.kind == TicketKind.DeliveryIssue &&
      ticket.status == TicketStatus.Open
  )

def sanitizeAfterSalesReason(reason: ReasonText): Either[ErrorMessage, ReasonText] =
  sanitizeRequiredText(
    reason,
    DeliveryValidationDefaults.OrderReasonMaxLength,
    ValidationMessages.AfterSales.AfterSalesReasonRequired,
  )

def validateExpectedCompensation(
    request: SubmitAfterSalesRequest
): Either[ErrorMessage, Option[CurrencyCents]] =
  request.expectedCompensationCents match
    case Some(value) =>
      Either.cond(
        value > DeliveryValidationDefaults.CompensationAmountMinCentsExclusive,
        Some(value),
        ValidationMessages.AfterSales.ExpectedCompensationMustBePositive,
      )
    case None =>
      Either.cond(
        request.requestType != AfterSalesRequestType.CompensationRequest,
        None,
        ValidationMessages.AfterSales.ExpectedCompensationRequired,
      )

def resolveAfterSalesMode(request: ResolveAfterSalesRequest): AfterSalesResolutionMode =
  if request.approved then request.resolutionMode.getOrElse(AfterSalesResolutionMode.Balance)
  else AfterSalesResolutionMode.Manual

def resolveCreditedAmount(
    context: AfterSalesResolutionContext,
): Either[ErrorMessage, CurrencyCents] =
  if !context.request.approved then Right(NumericDefaults.ZeroCurrencyCents)
  else
    context.resolutionMode match
      case AfterSalesResolutionMode.Manual =>
        Right(NumericDefaults.ZeroCurrencyCents)
      case AfterSalesResolutionMode.Balance | AfterSalesResolutionMode.Coupon =>
        context.requestType match
          case AfterSalesRequestType.ReturnRequest =>
            val amount = context.request.actualCompensationCents.getOrElse(context.order.totalPriceCents)
            Either.cond(
              amount > DeliveryValidationDefaults.CompensationAmountMinCentsExclusive,
              amount,
              ValidationMessages.AfterSales.RefundAmountMustBePositive,
            )
          case AfterSalesRequestType.CompensationRequest =>
            context.request.actualCompensationCents.orElse(context.ticket.expectedCompensationCents) match
              case Some(value) if value > DeliveryValidationDefaults.CompensationAmountMinCentsExclusive =>
                Right(value)
              case Some(_) => Left(ValidationMessages.AfterSales.CompensationAmountMustBePositive)
              case None => Left(ValidationMessages.AfterSales.CompensationAmountRequired)

def buildAfterSalesOutcomeNote(
    requestType: AfterSalesRequestType,
    approved: ApprovalFlag,
    resolutionMode: AfterSalesResolutionMode,
    creditedAmount: CurrencyCents,
    issuedCoupon: Option[Coupon],
    resolutionNote: ResolutionText,
): DisplayText =
  if !approved then renderAfterSalesOutcomeMessage(AfterSalesOutcomeMessage.Rejected(resolutionNote))
  else
    resolutionMode match
      case AfterSalesResolutionMode.Balance =>
        requestType match
          case AfterSalesRequestType.ReturnRequest =>
            renderAfterSalesOutcomeMessage(AfterSalesOutcomeMessage.ReturnToBalance(creditedAmount, resolutionNote))
          case AfterSalesRequestType.CompensationRequest =>
            renderAfterSalesOutcomeMessage(AfterSalesOutcomeMessage.CompensationToBalance(creditedAmount, resolutionNote))
      case AfterSalesResolutionMode.Coupon =>
        val coupon = issuedCoupon.get
        renderAfterSalesOutcomeMessage(
          AfterSalesOutcomeMessage.CouponIssued(coupon.title, coupon.discountCents, resolutionNote)
        )
      case AfterSalesResolutionMode.Manual =>
        renderAfterSalesOutcomeMessage(AfterSalesOutcomeMessage.ManualApproved(resolutionNote))

def updateAfterSalesCustomer(
    customer: Customer,
    approved: ApprovalFlag,
    resolutionMode: AfterSalesResolutionMode,
    creditedAmount: CurrencyCents,
    issuedCoupon: Option[Coupon],
): Customer =
  resolutionMode match
    case AfterSalesResolutionMode.Balance if approved && creditedAmount > NumericDefaults.ZeroCurrencyCents =>
      customer.copy(
        metrics = customer.metrics.copy(
          balanceCents = customer.balanceCents + creditedAmount
        )
      )
    case AfterSalesResolutionMode.Coupon if approved =>
      customer.copy(
        metrics = customer.metrics.copy(
          coupons = issuedCoupon.toList ++ customer.coupons
        )
      )
    case _ => customer

def buildAfterSalesTicketSummary(
    requestType: AfterSalesRequestType,
    reason: ReasonText,
    expectedCompensationCents: Option[CurrencyCents],
): SummaryText =
  requestType match
    case AfterSalesRequestType.ReturnRequest =>
      renderAfterSalesTicketSummary(AfterSalesTicketSummaryMessage.ReturnRequest(reason))
    case AfterSalesRequestType.CompensationRequest =>
      renderAfterSalesTicketSummary(AfterSalesTicketSummaryMessage.CompensationRequest(reason, expectedCompensationCents))

def buildAfterSalesTicket(
    order: OrderSummary,
    request: SubmitAfterSalesRequest,
    reason: ReasonText,
    expectedCompensationCents: Option[CurrencyCents],
    timestamp: IsoDateTime,
): AdminTicket =
  AdminTicket(
    id = nextId(wrapText[DisplayText]("ticket")),
    orderId = order.id,
    kind = TicketKind.DeliveryIssue,
    status = TicketStatus.Open,
    summary = buildAfterSalesTicketSummary(request.requestType, reason, expectedCompensationCents),
    requestType = Some(request.requestType),
    submittedByRole = Some(UserRole.customer),
    submittedByName = Some(order.customerName),
    expectedCompensationCents = expectedCompensationCents,
    actualCompensationCents = None,
    approved = None,
    resolutionMode = None,
    issuedCoupon = None,
    submittedAt = timestamp,
    reviewedAt = None,
    resolutionNote = None,
    updatedAt = timestamp,
  )

def buildAfterSalesCoupon(
    customerId: CustomerId,
    requestType: AfterSalesRequestType,
    discountCents: CurrencyCents,
    currentTime: IsoDateTime,
): Coupon =
  val title =
    requestType match
      case AfterSalesRequestType.ReturnRequest => afterSalesReturnCouponTitle
      case AfterSalesRequestType.CompensationRequest => afterSalesCompensationCouponTitle
  Coupon(
    id = List("coupon-", customerId.raw, "-afterSales-", java.util.UUID.randomUUID().toString.take(IdentifierDefaults.GeneratedCouponSuffixLength)).mkString,
    title = title,
    discountCents = discountCents,
    minimumSpendCents = NumericDefaults.ZeroCurrencyCents,
    description = afterSalesCouponDescription,
    expiresAt = isoDateTimeFromInstant(unsafeParseIsoInstant(currentTime).plusSeconds(CouponValidityDays * TimeDefaults.SecondsPerDay)),
  )
