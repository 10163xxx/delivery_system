package shared.app

import domain.shared.given

import domain.shared.*

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

private val blankText = new DisplayText("")
private val reviewReasonPrefix = new DisplayText("，理由：")
private val reviewExtraPrefix = new DisplayText("，补充：")
private val compensationAmountMissing = new DisplayText("未填写金额")
private val reviewSeparator = new DisplayText("、")

private def text(value: String): DisplayText =
  new DisplayText(value)

private def showValue[T](value: T)(using renderer: DisplayTextRenderer[T]): DisplayText =
  renderer.render(value)

private def joinText(parts: DisplayText*): DisplayText =
  new DisplayText(parts.map(_.raw).mkString)

private def trimText(value: DisplayText): DisplayText =
  new DisplayText(value.raw.trim)

private def joinLabels(labels: List[DisplayText]): DisplayText =
  new DisplayText(labels.map(_.raw).mkString(reviewSeparator.raw))

private def formatBusinessCurrency(amountCents: CurrencyCents): DisplayText =
  val amount = BigDecimal(amountCents)
    ./(BigDecimal(NumericDefaults.CurrencyCentsPerYuan))
    .setScale(2, BigDecimal.RoundingMode.HALF_UP)
  joinText(showValue(amount), text(" 元"))

def renderReviewDetail(
      roleLabel: DisplayText,
      rating: RatingValue,
      comment: Option[ReasonText],
      extraNote: Option[NoteText],
  ): DisplayText =
  joinText(
    roleLabel,
    text(" "),
    showValue(rating),
    text(" 星"),
    comment.map(value => joinText(reviewReasonPrefix, showValue(value))).getOrElse(blankText),
    extraNote.map(value => joinText(reviewExtraPrefix, showValue(value))).getOrElse(blankText),
  )

def renderReviewRatingLabel(roleLabel: DisplayText, rating: RatingValue): DisplayText =
  joinText(roleLabel, text(" "), showValue(rating), text(" 星"))

def renderReviewAppealResolvedNote(resolutionNote: ResolutionText): ResolutionText =
  new ResolutionText(joinText(text("申诉成功，评价已撤销："), showValue(resolutionNote)).raw)

def renderAdminTicketResolution(resolution: ResolutionText, note: NoteText): ResolutionText =
  new ResolutionText(joinText(showValue(resolution), text("；"), showValue(note)).raw)

def renderOrderTimelineMessage(message: OrderTimelineMessage): DisplayText =
  message match
    case OrderTimelineMessage.OrderPlaced(scheduledDeliveryAt, Some(couponTitle), couponDiscountCents) =>
      joinText(
        text("顾客已下单并完成余额支付，使用 "),
        couponTitle,
        text(" 抵扣 "),
        formatBusinessCurrency(couponDiscountCents),
        text("，预约送达时间 "),
        showValue(scheduledDeliveryAt),
      )
    case OrderTimelineMessage.OrderPlaced(scheduledDeliveryAt, None, _) =>
      joinText(text("顾客已下单并完成余额支付，预约送达时间 "), showValue(scheduledDeliveryAt))
    case OrderTimelineMessage.MerchantRejected(reason) =>
      joinText(text("商家已拒单，理由："), showValue(reason), text("。订单金额已原路退回"))
    case OrderTimelineMessage.RiderAssigned(riderName) =>
      joinText(text("已指派骑手 "), showValue(riderName))
    case OrderTimelineMessage.CustomerReviewSubmitted(labels) =>
      joinText(text("顾客已提交"), joinLabels(labels), text("评价"))
    case OrderTimelineMessage.ReviewRevoked(reason) =>
      joinText(text("评价因申诉成功被撤销："), showValue(reason))
    case OrderTimelineMessage.AfterSalesSubmitted =>
      text("顾客已提交售后申请，等待管理员处理")
    case OrderTimelineMessage.PartialRefundRequested(itemName, quantity, reason) =>
      joinText(text("顾客申请退掉 "), itemName, text(" x "), showValue(quantity), text("，原因："), showValue(reason))
    case OrderTimelineMessage.PartialRefundApproved(itemName, quantity, refundAmountCents, resolutionNote) =>
      joinText(
        text("商家同意退掉 "),
        itemName,
        text(" x "),
        showValue(quantity),
        text("，已退款 "),
        formatBusinessCurrency(refundAmountCents),
        text("："),
        showValue(resolutionNote),
      )
    case OrderTimelineMessage.PartialRefundRejected(itemName, quantity, resolutionNote) =>
      joinText(text("商家拒绝退掉 "), itemName, text(" x "), showValue(quantity), text("："), showValue(resolutionNote))

def renderAfterSalesOutcomeMessage(message: AfterSalesOutcomeMessage): DisplayText =
  message match
    case AfterSalesOutcomeMessage.Rejected(resolutionNote) =>
      joinText(text("管理员已驳回售后申请："), showValue(resolutionNote))
    case AfterSalesOutcomeMessage.ReturnToBalance(amountCents, resolutionNote) =>
      joinText(text("管理员已同意退货售后，退款 "), formatBusinessCurrency(amountCents), text(" 已退回顾客余额。"), showValue(resolutionNote))
    case AfterSalesOutcomeMessage.CompensationToBalance(amountCents, resolutionNote) =>
      joinText(text("管理员已同意赔偿售后，赔偿 "), formatBusinessCurrency(amountCents), text(" 已发放至顾客余额。"), showValue(resolutionNote))
    case AfterSalesOutcomeMessage.CouponIssued(couponTitle, discountCents, resolutionNote) =>
      joinText(
        text("管理员已同意售后申请，已补发优惠券 "),
        couponTitle,
        text("（"),
        formatBusinessCurrency(discountCents),
        text("，无门槛可用）。"),
        showValue(resolutionNote),
      )
    case AfterSalesOutcomeMessage.ManualApproved(resolutionNote) =>
      joinText(text("管理员已同意售后申请，本次不发放退款或优惠券。"), showValue(resolutionNote))

def renderAfterSalesTicketSummary(message: AfterSalesTicketSummaryMessage): SummaryText =
  message match
    case AfterSalesTicketSummaryMessage.ReturnRequest(reason) =>
      new SummaryText(joinText(text("顾客申请退货售后："), showValue(reason)).raw)
    case AfterSalesTicketSummaryMessage.CompensationRequest(reason, expectedCompensationCents) =>
      val amountText = expectedCompensationCents.map(formatBusinessCurrency).getOrElse(compensationAmountMissing)
      new SummaryText(joinText(text("顾客申请赔偿售后（期望 "), amountText, text("）："), showValue(reason)).raw)

def renderReviewTicketSummary(message: ReviewTicketSummaryMessage): SummaryText =
  message match
    case ReviewTicketSummaryMessage.Positive(customerName, storeName, detail) =>
      new SummaryText(trimText(joinText(showValue(customerName), text(" 对 "), storeName, text(" 给出好评。"), detail)).raw)
    case ReviewTicketSummaryMessage.Negative(customerName, detail) =>
      new SummaryText(trimText(joinText(showValue(customerName), text(" 提交了差评。"), detail)).raw)
    case ReviewTicketSummaryMessage.DeliveryIssue(customerName, detail) =>
      new SummaryText(trimText(joinText(showValue(customerName), text(" 反馈配送异常。"), detail)).raw)
