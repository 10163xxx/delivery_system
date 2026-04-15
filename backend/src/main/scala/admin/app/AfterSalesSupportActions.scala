package admin.app

import domain.shared.given

import cats.effect.IO
import domain.admin.*
import domain.auth.*
import domain.customer.*
import domain.order.*
import domain.shared.*
import shared.app.*

import java.time.Instant

private case class AfterSalesResolutionContext(
      request: ResolveAfterSalesRequest,
      ticket: AdminTicket,
      order: OrderSummary,
      requestType: AfterSalesRequestType,
      resolutionMode: AfterSalesResolutionMode,
  )

private val afterSalesCouponDescription = new DescriptionText("管理员处理售后申请后补发，可在有效期内下单抵扣")
private val afterSalesReturnCouponTitle = new DisplayText("售后退货补偿券")
private val afterSalesCompensationCouponTitle = new DisplayText("售后补偿券")

private def findAfterSalesTicket(
      current: DeliveryAppState,
      ticketId: TicketId,
  ): Either[ErrorMessage, AdminTicket] =
    current.tickets.find(_.id == ticketId).toRight(ValidationMessages.AfterSalesTicketNotFound)

private def requireAfterSalesTicket(ticket: AdminTicket): Either[ErrorMessage, Unit] =
    Either.cond(ticket.kind == TicketKind.DeliveryIssue, (), ValidationMessages.TicketIsNotAfterSalesRequest)

private def requireOpenAfterSalesTicket(ticket: AdminTicket): Either[ErrorMessage, Unit] =
    Either.cond(ticket.status == TicketStatus.Open, (), ValidationMessages.AfterSalesAlreadyResolved)

private def findAfterSalesOrder(
      current: DeliveryAppState,
      orderId: OrderId,
  ): Either[ErrorMessage, OrderSummary] =
    current.orders.find(_.id == orderId).toRight(ValidationMessages.OrderNotFound)

private def findAfterSalesOrderByTicket(
      current: DeliveryAppState,
      ticket: AdminTicket,
  ): Either[ErrorMessage, OrderSummary] =
    current.orders.find(_.id == ticket.orderId).toRight(ValidationMessages.RelatedOrderNotFound)

private def findRelatedCustomer(
      current: DeliveryAppState,
      order: OrderSummary,
  ): Either[ErrorMessage, Customer] =
    current.customers.find(_.id == order.customerId).toRight(ValidationMessages.RelatedCustomerNotFound)

private def sanitizeSupportResolutionNote(value: ResolutionText): Either[ErrorMessage, ResolutionText] =
    sanitizeRequiredText(
      value,
      DeliveryValidationDefaults.OrderReasonMaxLength,
      ValidationMessages.ResolutionNoteRequired,
    )

private def hasPendingAfterSalesTicket(
      current: DeliveryAppState,
      orderId: OrderId,
  ): ApprovalFlag =
    current.tickets.exists(ticket =>
      ticket.orderId == orderId &&
        ticket.kind == TicketKind.DeliveryIssue &&
        ticket.status == TicketStatus.Open
    )

private def sanitizeAfterSalesReason(reason: ReasonText): Either[ErrorMessage, ReasonText] =
    sanitizeRequiredText(
      reason,
      DeliveryValidationDefaults.OrderReasonMaxLength,
      ValidationMessages.AfterSalesReasonRequired,
    )

private def validateExpectedCompensation(
      request: SubmitAfterSalesRequest
  ): Either[ErrorMessage, Option[CurrencyCents]] =
    request.expectedCompensationCents match
      case Some(value) =>
        Either.cond(
          value > DeliveryValidationDefaults.CompensationAmountMinCentsExclusive,
          Some(value),
          ValidationMessages.ExpectedCompensationMustBePositive,
        )
      case None =>
        Either.cond(
          request.requestType != AfterSalesRequestType.CompensationRequest,
          None,
          ValidationMessages.ExpectedCompensationRequired,
        )

private def resolveAfterSalesMode(request: ResolveAfterSalesRequest): AfterSalesResolutionMode =
    if request.approved then request.resolutionMode.getOrElse(AfterSalesResolutionMode.Balance)
    else AfterSalesResolutionMode.Manual

private def resolveCreditedAmount(
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
                ValidationMessages.RefundAmountMustBePositive,
              )
            case AfterSalesRequestType.CompensationRequest =>
              context.request.actualCompensationCents.orElse(context.ticket.expectedCompensationCents) match
                case Some(value) if value > DeliveryValidationDefaults.CompensationAmountMinCentsExclusive =>
                  Right(value)
                case Some(_) =>
                  Left(ValidationMessages.CompensationAmountMustBePositive)
                case None =>
                  Left(ValidationMessages.CompensationAmountRequired)

private def buildAfterSalesOutcomeNote(
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
              renderAfterSalesOutcomeMessage(
                AfterSalesOutcomeMessage.ReturnToBalance(creditedAmount, resolutionNote)
              )
            case AfterSalesRequestType.CompensationRequest =>
              renderAfterSalesOutcomeMessage(
                AfterSalesOutcomeMessage.CompensationToBalance(creditedAmount, resolutionNote)
              )
        case AfterSalesResolutionMode.Coupon =>
          val coupon = issuedCoupon.get
          renderAfterSalesOutcomeMessage(
            AfterSalesOutcomeMessage.CouponIssued(coupon.title, coupon.discountCents, resolutionNote)
          )
        case AfterSalesResolutionMode.Manual =>
          renderAfterSalesOutcomeMessage(AfterSalesOutcomeMessage.ManualApproved(resolutionNote))

private def updateAfterSalesCustomer(
      customer: Customer,
      approved: ApprovalFlag,
      resolutionMode: AfterSalesResolutionMode,
      creditedAmount: CurrencyCents,
      issuedCoupon: Option[Coupon],
  ): Customer =
    resolutionMode match
      case AfterSalesResolutionMode.Balance if approved && creditedAmount > NumericDefaults.ZeroCurrencyCents =>
        customer.copy(balanceCents = customer.balanceCents + creditedAmount)
      case AfterSalesResolutionMode.Coupon if approved =>
        customer.copy(coupons = issuedCoupon.toList ++ customer.coupons)
      case _ =>
        customer

private def buildAfterSalesTicketSummary(
      requestType: AfterSalesRequestType,
      reason: ReasonText,
      expectedCompensationCents: Option[CurrencyCents],
  ): SummaryText =
    requestType match
      case AfterSalesRequestType.ReturnRequest =>
        renderAfterSalesTicketSummary(AfterSalesTicketSummaryMessage.ReturnRequest(reason))
      case AfterSalesRequestType.CompensationRequest =>
        renderAfterSalesTicketSummary(
          AfterSalesTicketSummaryMessage.CompensationRequest(reason, expectedCompensationCents)
        )

private def buildAfterSalesTicket(
      order: OrderSummary,
      request: SubmitAfterSalesRequest,
      reason: ReasonText,
      expectedCompensationCents: Option[CurrencyCents],
      timestamp: IsoDateTime,
  ): AdminTicket =
    AdminTicket(
      id = nextId(new DisplayText("ticket")),
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

private def buildAfterSalesCoupon(
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
      id = List("coupon-", customerId, "-after-sales-", java.util.UUID.randomUUID().toString.take(IdentifierDefaults.GeneratedCouponSuffixLength)).mkString,
      title = title,
      discountCents = discountCents,
      minimumSpendCents = NumericDefaults.ZeroCurrencyCents,
      description = afterSalesCouponDescription,
      expiresAt = new IsoDateTime(Instant.parse(currentTime.raw).plusSeconds(CouponValidityDays * TimeDefaults.SecondsPerDay).toString),
    )

def resolveAfterSalesTicket(
      ticketId: TicketId,
      request: ResolveAfterSalesRequest,
  ): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          ticket <- findAfterSalesTicket(current, ticketId)
          _ <- requireAfterSalesTicket(ticket)
          _ <- requireOpenAfterSalesTicket(ticket)
          order <- findAfterSalesOrderByTicket(current, ticket)
          customer <- findRelatedCustomer(current, order)
          requestType <- ticket.requestType.toRight(ValidationMessages.MissingAfterSalesRequestType)
          resolutionNote <- sanitizeSupportResolutionNote(request.resolutionNote)
          resolutionMode = resolveAfterSalesMode(request)
          creditedAmount <- resolveCreditedAmount(
            AfterSalesResolutionContext(request, ticket, order, requestType, resolutionMode)
          )
        yield
          val timestamp = now()
          val issuedCoupon =
            if request.approved && resolutionMode == AfterSalesResolutionMode.Coupon then
              Some(buildAfterSalesCoupon(customer.id, requestType, creditedAmount, timestamp))
            else None
          val outcomeNote =
            buildAfterSalesOutcomeNote(
              requestType,
              request.approved,
              resolutionMode,
              creditedAmount,
              issuedCoupon,
              resolutionNote,
            )
          val nextCustomers =
            current.customers.map(entry =>
              if entry.id == customer.id then
                updateAfterSalesCustomer(entry, request.approved, resolutionMode, creditedAmount, issuedCoupon)
              else entry
            )
          val nextOrders = current.orders.map(entry =>
            if entry.id == order.id then
              entry.copy(
                updatedAt = timestamp,
                timeline = entry.timeline :+ OrderTimelineEntry(entry.status, outcomeNote, timestamp),
              )
            else entry
          )
          val nextTickets = current.tickets.map(entry =>
            if entry.id == ticket.id then
              entry.copy(
                status = TicketStatus.Resolved,
                approved = Some(request.approved),
                actualCompensationCents =
                  if request.approved && creditedAmount > NumericDefaults.ZeroCurrencyCents then Some(creditedAmount) else None,
                resolutionMode = if request.approved then Some(resolutionMode) else Some(AfterSalesResolutionMode.Manual),
                issuedCoupon = issuedCoupon,
                resolutionNote = Some(resolutionNote),
                reviewedAt = Some(timestamp),
                updatedAt = timestamp,
              )
            else entry
          )
          withDerivedData(current.copy(customers = nextCustomers, orders = nextOrders, tickets = nextTickets))
      }
    }

def submitAfterSalesRequest(
      orderId: OrderId,
      request: SubmitAfterSalesRequest,
  ): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          order <- findAfterSalesOrder(current, orderId)
          _ <- Either.cond(!hasPendingAfterSalesTicket(current, orderId), (), ValidationMessages.PendingAfterSalesExists)
          reason <- sanitizeAfterSalesReason(request.reason)
          expectedCompensationCents <- validateExpectedCompensation(request)
        yield
          val timestamp = now()
          val ticket = buildAfterSalesTicket(order, request, reason, expectedCompensationCents, timestamp)
          val nextOrders = current.orders.map(entry =>
            if entry.id == order.id then
              entry.copy(
                updatedAt = timestamp,
                timeline = entry.timeline :+ OrderTimelineEntry(
                  entry.status,
                  renderOrderTimelineMessage(OrderTimelineMessage.AfterSalesSubmitted),
                  timestamp,
                ),
              )
            else entry
          )
          withDerivedData(current.copy(orders = nextOrders, tickets = ticket :: current.tickets))
      }
    }
