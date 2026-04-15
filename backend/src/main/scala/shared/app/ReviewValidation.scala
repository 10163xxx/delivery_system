package shared.app

import domain.shared.given

import domain.admin.*
import domain.order.*
import domain.review.*
import domain.shared.*

private val merchantReviewLabel = new DisplayText("商家")
private val riderReviewLabel = new DisplayText("骑手")
private val reviewDetailSeparator = new DisplayText("；")

private def joinReviewDetails(details: List[DisplayText]): DisplayText =
  new DisplayText(details.map(_.raw).mkString(reviewDetailSeparator.raw))

def validateReviewRequest(
      request: ReviewOrderRequest
  ): Either[ErrorMessage, ReviewOrderRequest] =
    for
      _ <- Either.cond(request.storeReview.nonEmpty || request.riderReview.nonEmpty, (), ValidationMessages.ReviewRequired)
      storeReview <- validateReviewSubmission(request.storeReview, merchantReviewLabel)
      riderReview <- validateReviewSubmission(request.riderReview, riderReviewLabel)
    yield ReviewOrderRequest(
      storeReview = storeReview,
      riderReview = riderReview,
    )

private def validateReviewSubmission(
    review: Option[ReviewSubmission],
    label: DisplayText,
): Either[ErrorMessage, Option[ReviewSubmission]] =
  review match
      case None => Right(None)
      case Some(value) =>
        for
          _ <- Either.cond(
            value.rating >= DeliveryValidationDefaults.ReviewRatingMin &&
              value.rating <= DeliveryValidationDefaults.ReviewRatingMax,
            (),
            reviewRatingInvalid(label),
          )
          comment = sanitizeOptionalText(value.comment, DeliveryValidationDefaults.ReviewCommentMaxLength)
          _ <- Either.cond(
            value.rating == DeliveryValidationDefaults.ReviewRatingMax || comment.nonEmpty,
            (),
            lowRatingCommentRequired(label),
          )
        yield Some(
          ReviewSubmission(
            rating = value.rating,
            comment = comment,
            extraNote = sanitizeOptionalText(value.extraNote, DeliveryValidationDefaults.ReviewExtraNoteMaxLength),
          )
        )

def validateAppealRole(
      order: OrderSummary,
      appellantRole: AppealRole,
  ): Either[ErrorMessage, Unit] =
    appellantRole match
      case AppealRole.Merchant => Either.cond(order.storeRating.nonEmpty, (), ValidationMessages.StoreReviewAppealUnavailable)
      case AppealRole.Rider => Either.cond(order.riderId.nonEmpty && order.riderRating.nonEmpty, (), ValidationMessages.RiderReviewAppealUnavailable)

def reviewTicket(
      order: OrderSummary,
      request: ReviewOrderRequest,
      timestamp: IsoDateTime,
  ): Option[AdminTicket] =
    val ratings = List(request.storeReview.map(_.rating), request.riderReview.map(_.rating)).flatten
    if ratings.isEmpty then None
    else
      val lowestRating = ratings.min
      val highestRating = ratings.max
      val ticketKind =
        if lowestRating <= NumericDefaults.NegativeReviewThreshold then Some(TicketKind.NegativeReview)
        else if highestRating >= NumericDefaults.PositiveReviewThreshold then Some(TicketKind.PositiveReview)
        else None

      ticketKind.map(kind =>
        AdminTicket(
          id = nextId(new DisplayText("tkt")),
          orderId = order.id,
          kind = kind,
          status = TicketStatus.Open,
          summary = buildTicketSummary(order, request, kind),
          requestType = None,
          submittedByRole = Some(UserRole.customer),
          submittedByName = Some(order.customerName),
          expectedCompensationCents = None,
          actualCompensationCents = None,
          approved = None,
          resolutionMode = None,
          issuedCoupon = None,
          submittedAt = timestamp,
          reviewedAt = None,
          resolutionNote = None,
          updatedAt = timestamp,
        )
      )

private def buildTicketSummary(
    order: OrderSummary,
    request: ReviewOrderRequest,
    kind: TicketKind,
): SummaryText =
  val detail = joinReviewDetails(List(
      request.storeReview.map(review =>
        renderReviewDetail(merchantReviewLabel, review.rating, review.comment, review.extraNote)
      ),
      request.riderReview.map(review =>
        renderReviewDetail(riderReviewLabel, review.rating, review.comment, review.extraNote)
      ),
    ).flatten)
    kind match
      case TicketKind.PositiveReview =>
        renderReviewTicketSummary(ReviewTicketSummaryMessage.Positive(order.customerName, order.storeName, detail))
      case TicketKind.NegativeReview =>
        renderReviewTicketSummary(ReviewTicketSummaryMessage.Negative(order.customerName, detail))
      case TicketKind.DeliveryIssue =>
        renderReviewTicketSummary(ReviewTicketSummaryMessage.DeliveryIssue(order.customerName, detail))

def applyReviewToOrder(
      order: OrderSummary,
      request: ReviewOrderRequest,
      timestamp: IsoDateTime,
  ): OrderSummary =
    val noteSegments = List(
      request.storeReview.map(review => renderReviewRatingLabel(merchantReviewLabel, review.rating)),
      request.riderReview.map(review => renderReviewRatingLabel(riderReviewLabel, review.rating)),
    ).flatten
    order.copy(
      storeRating = request.storeReview.map(_.rating).orElse(order.storeRating),
      riderRating = request.riderReview.map(_.rating).orElse(order.riderRating),
      reviewComment = request.storeReview.flatMap(_.comment).orElse(request.riderReview.flatMap(_.comment)).orElse(order.reviewComment),
      reviewExtraNote = request.storeReview.flatMap(_.extraNote).orElse(request.riderReview.flatMap(_.extraNote)).orElse(order.reviewExtraNote),
      storeReviewComment = request.storeReview.flatMap(_.comment).orElse(order.storeReviewComment),
      storeReviewExtraNote = request.storeReview.flatMap(_.extraNote).orElse(order.storeReviewExtraNote),
      riderReviewComment = request.riderReview.flatMap(_.comment).orElse(order.riderReviewComment),
      riderReviewExtraNote = request.riderReview.flatMap(_.extraNote).orElse(order.riderReviewExtraNote),
      merchantRejectReason = order.merchantRejectReason,
      reviewStatus = ReviewStatus.Active,
      updatedAt = timestamp,
      timeline = order.timeline :+ OrderTimelineEntry(
        OrderStatus.Completed,
        renderOrderTimelineMessage(OrderTimelineMessage.CustomerReviewSubmitted(noteSegments)),
        timestamp,
      ),
    )

def revokeReview(
      order: OrderSummary,
      reason: ReasonText,
      timestamp: IsoDateTime,
  ): OrderSummary =
    order.copy(
      reviewStatus = ReviewStatus.Revoked,
      reviewRevokedReason = Some(reason),
      reviewRevokedAt = Some(timestamp),
      updatedAt = timestamp,
      timeline = order.timeline :+ OrderTimelineEntry(
        OrderStatus.Completed,
        renderOrderTimelineMessage(OrderTimelineMessage.ReviewRevoked(reason)),
        timestamp,
      ),
    )

def closeTicketsForOrder(
      tickets: List[AdminTicket],
      orderId: OrderId,
      resolutionNote: ResolutionText,
      timestamp: IsoDateTime,
  ): List[AdminTicket] =
    tickets.map(ticket =>
      if ticket.orderId == orderId && ticket.status == TicketStatus.Open then
        ticket.copy(
          status = TicketStatus.Resolved,
          approved = None,
          resolutionNote = Some(resolutionNote),
          reviewedAt = Some(timestamp),
          updatedAt = timestamp,
        )
      else ticket
    )
