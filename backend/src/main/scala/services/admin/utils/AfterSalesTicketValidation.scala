package services.admin.utils

// Business note: after-sales ticket lookup and validation rules shared by submit and resolution actions.
import system.objects.given
import services.order.objects.apiTypes.*
import system.app.objects.*
import services.auth.objects.*

import services.admin.objects.*
import services.customer.objects.*
import services.order.objects.*
import system.objects.*
import system.app.*

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

def hasPendingAfterSalesTicket(
    current: DeliveryAppState,
    orderId: OrderId,
): ApprovalFlag =
  new ApprovalFlag(
    current.tickets.exists(ticket =>
      ticket.orderId == orderId &&
        ticket.kind == TicketKind.DeliveryIssue &&
        ticket.status == TicketStatus.Open
    )
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
    identity = AdminTicketIdentity(
      id = nextId(wrapText[DisplayText]("ticket")),
      orderId = order.id,
      kind = TicketKind.DeliveryIssue,
      status = TicketStatus.Open,
      summary = buildAfterSalesTicketSummary(request.requestType, reason, expectedCompensationCents),
    ),
    submission = AdminTicketSubmission(
      requestType = Some(request.requestType),
      submittedByRole = Some(UserRole.customer),
      submittedByName = Some(order.customerName),
      expectedCompensationCents = expectedCompensationCents,
      submittedAt = timestamp,
    ),
    resolution = AdminTicketResolution(
      actualCompensationCents = None,
      approved = None,
      resolutionMode = None,
      issuedCoupon = None,
      reviewedAt = None,
      resolutionNote = None,
    ),
    lifecycle = AdminTicketLifecycle(updatedAt = timestamp),
  )
