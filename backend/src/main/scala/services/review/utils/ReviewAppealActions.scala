package services.review.utils

import domain.shared.given

import cats.effect.IO
import domain.admin.*
import domain.order.*
import domain.review.*
import domain.shared.*
import system.app.*

private def hasPendingReviewAppeal(
      current: DeliveryAppState,
      orderId: OrderId,
      appellantRole: AppealRole,
  ): ApprovalFlag =
    current.reviewAppeals.exists(appeal =>
      appeal.orderId == orderId &&
        appeal.appellantRole == appellantRole &&
        appeal.status == AppealStatus.Pending
    )

private def resolveReviewAppealOrders(
      current: DeliveryAppState,
      order: OrderSummary,
      approved: ApprovalFlag,
      resolutionNote: ResolutionText,
      timestamp: IsoDateTime,
  ): List[OrderSummary] =
    if approved then
      current.orders.map(entry =>
        if entry.id == order.id then revokeReview(entry, new ReasonText(resolutionNote.raw), timestamp) else entry
      )
    else current.orders

private def resolveReviewAppealTickets(
      current: DeliveryAppState,
      orderId: OrderId,
      approved: ApprovalFlag,
      resolutionNote: ResolutionText,
      timestamp: IsoDateTime,
  ): List[AdminTicket] =
    if approved then
      closeTicketsForOrder(
        current.tickets,
        orderId,
        renderReviewAppealResolvedNote(resolutionNote),
        timestamp,
      )
    else current.tickets

private def applyResolvedReviewAppeal(
      current: DeliveryAppState,
      reviewedAppeal: ReviewAppeal,
      nextOrders: List[OrderSummary],
      nextTickets: List[AdminTicket],
  ): DeliveryAppState =
    withDerivedData(
      current.copy(
        reviewAppeals = replaceAppeal(current.reviewAppeals, reviewedAppeal),
        deliveryState = current.deliveryState.copy(
          orders = nextOrders,
          tickets = nextTickets,
        ),
      )
    )

def submitReviewAppeal(
      orderId: OrderId,
      request: ReviewAppealRequest,
  ): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          order <- findReviewOrder(current, orderId)
          _ <- Either.cond(order.reviewStatus == ReviewStatus.Active, (), ValidationMessages.Review.ReviewRevokedCannotAppeal)
          _ <- validateAppealRole(order, request.appellantRole)
          _ <- Either.cond(!hasPendingReviewAppeal(current, orderId, request.appellantRole), (), ValidationMessages.Review.PendingAppealExists)
          reason <- sanitizeAppealReason(request.reason)
        yield
          val timestamp = now()
          val appeal = buildReviewAppeal(order, request.appellantRole, reason, timestamp)
          withDerivedData(current.copy(reviewAppeals = appeal :: current.reviewAppeals))
      }
    }

def resolveReviewAppeal(
      appealId: ReviewAppealId,
      request: ResolveReviewAppealRequest,
  ): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          appeal <- findReviewAppeal(current, appealId)
          _ <- requirePendingAppeal(appeal)
          order <- current.orders.find(_.id == appeal.orderId).toRight(ValidationMessages.AfterSales.RelatedOrderNotFound)
          resolutionNote <- sanitizeResolutionNote(request.resolutionNote, ValidationMessages.AfterSales.ResolutionNoteRequired)
        yield
          val timestamp = now()
          val reviewedAppeal = reviewAppeal(appeal, request.approved, resolutionNote, timestamp)
          val nextOrders =
            resolveReviewAppealOrders(current, order, request.approved, resolutionNote, timestamp)
          val nextTickets =
            resolveReviewAppealTickets(current, order.id, request.approved, resolutionNote, timestamp)
          applyResolvedReviewAppeal(current, reviewedAppeal, nextOrders, nextTickets)
      }
    }
