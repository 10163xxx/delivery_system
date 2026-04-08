package app.delivery

import cats.effect.IO
import domain.admin.*
import domain.auth.*
import domain.order.*
import domain.review.*
import domain.shared.*

def submitReviewAppeal(
      orderId: String,
      request: ReviewAppealRequest,
  ): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          order <- current.orders.find(_.id == orderId).toRight(ValidationMessages.OrderNotFound)
          _ <- Either.cond(order.reviewStatus == ReviewStatus.Active, (), ValidationMessages.ReviewRevokedCannotAppeal)
          _ <- validateAppealRole(order, request.appellantRole)
          _ <- Either.cond(
            !current.reviewAppeals.exists(appeal =>
              appeal.orderId == orderId &&
              appeal.appellantRole == request.appellantRole &&
              appeal.status == AppealStatus.Pending,
            ),
            (),
            ValidationMessages.PendingAppealExists,
          )
          reason <- sanitizeRequiredText(request.reason, DeliveryValidationDefaults.OrderReasonMaxLength, ValidationMessages.AppealReasonRequired)
        yield
          val timestamp = now()
          val appeal = ReviewAppeal(
            id = nextId("apl"),
            orderId = order.id,
            customerId = order.customerId,
            customerName = order.customerName,
            storeId = order.storeId,
            riderId = order.riderId,
            appellantRole = request.appellantRole,
            reason = reason,
            status = AppealStatus.Pending,
            resolutionNote = None,
            submittedAt = timestamp,
            reviewedAt = None,
          )
          withDerivedData(current.copy(reviewAppeals = appeal :: current.reviewAppeals))
      }
    }

def resolveReviewAppeal(
      appealId: String,
      request: ResolveReviewAppealRequest,
  ): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          appeal <- current.reviewAppeals.find(_.id == appealId).toRight(ValidationMessages.AppealNotFound)
          _ <- Either.cond(appeal.status == AppealStatus.Pending, (), ValidationMessages.AppealAlreadyResolved)
          order <- current.orders.find(_.id == appeal.orderId).toRight(ValidationMessages.RelatedOrderNotFound)
          resolutionNote <- sanitizeRequiredText(request.resolutionNote, DeliveryValidationDefaults.OrderReasonMaxLength, ValidationMessages.ResolutionNoteRequired)
        yield
          val timestamp = now()
          val reviewedAppeal = appeal.copy(
            status = if request.approved then AppealStatus.Approved else AppealStatus.Rejected,
            resolutionNote = Some(resolutionNote),
            reviewedAt = Some(timestamp),
          )
          val nextOrders =
            if request.approved then
              current.orders.map(entry =>
                if entry.id == order.id then revokeReview(entry, resolutionNote, timestamp) else entry
              )
            else current.orders
          val nextTickets =
            if request.approved then
              closeTicketsForOrder(current.tickets, order.id, s"申诉成功，评价已撤销：$resolutionNote", timestamp)
            else current.tickets
          withDerivedData(
            current.copy(
              orders = nextOrders,
              tickets = nextTickets,
              reviewAppeals = replaceAppeal(current.reviewAppeals, reviewedAppeal),
            )
          )
      }
    }

def submitEligibilityReview(
      request: EligibilityReviewRequest
  ): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          targetName <- findEligibilityTargetName(current, request)
          _ <- validateEligibilityTargetState(current, request)
          _ <- Either.cond(
            !current.eligibilityReviews.exists(review =>
              review.target == request.target &&
              review.targetId == request.targetId &&
              review.status == AppealStatus.Pending,
            ),
            (),
            ValidationMessages.PendingEligibilityReviewExists,
          )
          reason <- sanitizeRequiredText(request.reason, DeliveryValidationDefaults.OrderReasonMaxLength, ValidationMessages.EligibilityReviewReasonRequired)
        yield
          val timestamp = now()
          val review = EligibilityReview(
            id = nextId("eqr"),
            target = request.target,
            targetId = request.targetId,
            targetName = targetName,
            reason = reason,
            status = AppealStatus.Pending,
            resolutionNote = None,
            submittedAt = timestamp,
            reviewedAt = None,
          )
          withDerivedData(current.copy(eligibilityReviews = review :: current.eligibilityReviews))
      }
    }

def resolveEligibilityReview(
      reviewId: String,
      request: ResolveEligibilityReviewRequest,
  ): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          review <- current.eligibilityReviews.find(_.id == reviewId).toRight(ValidationMessages.EligibilityReviewNotFound)
          _ <- Either.cond(review.status == AppealStatus.Pending, (), ValidationMessages.EligibilityReviewAlreadyResolved)
          resolutionNote <- sanitizeRequiredText(request.resolutionNote, DeliveryValidationDefaults.OrderReasonMaxLength, ValidationMessages.EligibilityReviewResolutionRequired)
        yield
          val timestamp = now()
          val reviewed = review.copy(
            status = if request.approved then AppealStatus.Approved else AppealStatus.Rejected,
            resolutionNote = Some(resolutionNote),
            reviewedAt = Some(timestamp),
          )
          withDerivedData(
            current.copy(eligibilityReviews = replaceEligibilityReview(current.eligibilityReviews, reviewed))
          )
      }
    }

def resolveTicket(orderId: String, request: ResolveTicketRequest): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        current.tickets
          .find(ticket =>
            ticket.orderId == orderId &&
              ticket.status == TicketStatus.Open &&
              ticket.kind != TicketKind.DeliveryIssue,
          )
          .toRight(ValidationMessages.NoPendingTicket)
          .flatMap { _ =>
            for
              resolution <- sanitizeRequiredText(request.resolution, DeliveryValidationDefaults.TicketResolutionMaxLength, ValidationMessages.TicketResolutionRequired)
              note <- sanitizeRequiredText(request.note, DeliveryValidationDefaults.OrderReasonMaxLength, ValidationMessages.ResolutionNoteRequired)
            yield
              val timestamp = now()
              val nextTickets = current.tickets.map(ticket =>
                if ticket.orderId == orderId && ticket.status == TicketStatus.Open && ticket.kind != TicketKind.DeliveryIssue then
                  ticket.copy(
                    status = TicketStatus.Resolved,
                    approved = None,
                    resolutionNote = Some(s"$resolution；$note"),
                    reviewedAt = Some(timestamp),
                    updatedAt = timestamp,
                  )
                else ticket
              )
              withDerivedData(current.copy(tickets = nextTickets))
          }
      }
    }
