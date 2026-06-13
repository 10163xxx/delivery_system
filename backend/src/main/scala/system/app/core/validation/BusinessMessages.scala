package system.app

import domain.shared.given

import domain.shared.*

private val blankText = wrapText[DisplayText]("")
private val reviewReasonPrefix = wrapText[DisplayText]("，理由：")
private val reviewExtraPrefix = wrapText[DisplayText]("，补充：")
private val compensationAmountMissing = wrapText[DisplayText]("未填写金额")
private val reviewSeparator = wrapText[DisplayText]("、")

private def messageText(value: String): DisplayText =
  wrapText[DisplayText](value)

private def showValue[T](value: T)(using renderer: DisplayTextRenderer[T]): DisplayText =
  renderer.render(value)

private def joinText(parts: DisplayText*): DisplayText =
  wrapText[DisplayText](parts.map(_.raw).mkString)

private def trimText(value: DisplayText): DisplayText =
  wrapText[DisplayText](value.raw.trim)

private def joinLabels(labels: List[DisplayText]): DisplayText =
  wrapText[DisplayText](labels.map(_.raw).mkString(reviewSeparator.raw))

private def formatBusinessCurrency(amountCents: CurrencyCents): DisplayText =
  val amount = BigDecimal(amountCents)
    ./(BigDecimal(NumericDefaults.CurrencyCentsPerYuan))
    .setScale(NumericDefaults.CurrencyDisplayScale, BigDecimal.RoundingMode.HALF_UP)
  joinText(showValue(amount), messageText(" 元"))

def renderReviewDetail(
      roleLabel: DisplayText,
      rating: RatingValue,
      comment: Option[ReasonText],
      extraNote: Option[NoteText],
  ): DisplayText =
  joinText(
    roleLabel,
    messageText(" "),
    showValue(rating),
    messageText(" 星"),
    comment.map(value => joinText(reviewReasonPrefix, showValue(value))).getOrElse(blankText),
    extraNote.map(value => joinText(reviewExtraPrefix, showValue(value))).getOrElse(blankText),
  )

def renderReviewRatingLabel(roleLabel: DisplayText, rating: RatingValue): DisplayText =
  joinText(roleLabel, messageText(" "), showValue(rating), messageText(" 星"))

def renderReviewAppealResolvedNote(resolutionNote: ResolutionText): ResolutionText =
  wrapText[ResolutionText](joinText(messageText("申诉成功，评价已撤销："), showValue(resolutionNote)).raw)

def renderAdminTicketResolution(resolution: ResolutionText, note: NoteText): ResolutionText =
  wrapText[ResolutionText](joinText(showValue(resolution), messageText("；"), showValue(note)).raw)

def renderOrderTimelineMessage(message: OrderTimelineMessage): DisplayText =
  message match
    case OrderTimelineMessage.OrderPlaced(scheduledDeliveryAt, Some(couponTitle), couponDiscountCents) =>
      joinText(
        messageText("顾客已下单并完成余额支付，使用 "),
        couponTitle,
        messageText(" 抵扣 "),
        formatBusinessCurrency(couponDiscountCents),
        messageText("，预约送达时间 "),
        showValue(scheduledDeliveryAt),
      )
    case OrderTimelineMessage.OrderPlaced(scheduledDeliveryAt, None, _) =>
      joinText(messageText("顾客已下单并完成余额支付，预约送达时间 "), showValue(scheduledDeliveryAt))
    case OrderTimelineMessage.MerchantRejected(reason) =>
      joinText(messageText("商家已拒单，理由："), showValue(reason), messageText("。订单金额已原路退回"))
    case OrderTimelineMessage.RiderAssigned(riderName) =>
      joinText(messageText("已指派骑手 "), showValue(riderName))
    case OrderTimelineMessage.CustomerReviewSubmitted(labels) =>
      joinText(messageText("顾客已提交"), joinLabels(labels), messageText("评价"))
    case OrderTimelineMessage.ReviewRevoked(reason) =>
      joinText(messageText("评价因申诉成功被撤销："), showValue(reason))
    case OrderTimelineMessage.AfterSalesSubmitted =>
      messageText("顾客已提交售后申请，等待管理员处理")
    case OrderTimelineMessage.PartialRefundRequested(itemName, quantity, reason) =>
      joinText(messageText("顾客申请退掉 "), itemName, messageText(" x "), showValue(quantity), messageText("，原因："), showValue(reason))
    case OrderTimelineMessage.PartialRefundApproved(itemName, quantity, refundAmountCents, resolutionNote) =>
      joinText(
        messageText("商家同意退掉 "),
        itemName,
        messageText(" x "),
        showValue(quantity),
        messageText("，已退款 "),
        formatBusinessCurrency(refundAmountCents),
        messageText("："),
        showValue(resolutionNote),
      )
    case OrderTimelineMessage.PartialRefundRejected(itemName, quantity, resolutionNote) =>
      joinText(messageText("商家拒绝退掉 "), itemName, messageText(" x "), showValue(quantity), messageText("："), showValue(resolutionNote))

def renderAfterSalesOutcomeMessage(message: AfterSalesOutcomeMessage): DisplayText =
  message match
    case AfterSalesOutcomeMessage.Rejected(resolutionNote) =>
      joinText(messageText("管理员已驳回售后申请："), showValue(resolutionNote))
    case AfterSalesOutcomeMessage.ReturnToBalance(amountCents, resolutionNote) =>
      joinText(messageText("管理员已同意退货售后，退款 "), formatBusinessCurrency(amountCents), messageText(" 已退回顾客余额。"), showValue(resolutionNote))
    case AfterSalesOutcomeMessage.CompensationToBalance(amountCents, resolutionNote) =>
      joinText(messageText("管理员已同意赔偿售后，赔偿 "), formatBusinessCurrency(amountCents), messageText(" 已发放至顾客余额。"), showValue(resolutionNote))
    case AfterSalesOutcomeMessage.CouponIssued(couponTitle, discountCents, resolutionNote) =>
      joinText(
        messageText("管理员已同意售后申请，已补发优惠券 "),
        couponTitle,
        messageText("（"),
        formatBusinessCurrency(discountCents),
        messageText("，无门槛可用）。"),
        showValue(resolutionNote),
      )
    case AfterSalesOutcomeMessage.ManualApproved(resolutionNote) =>
      joinText(messageText("管理员已同意售后申请，本次不发放退款或优惠券。"), showValue(resolutionNote))

def renderAfterSalesTicketSummary(message: AfterSalesTicketSummaryMessage): SummaryText =
  message match
    case AfterSalesTicketSummaryMessage.ReturnRequest(reason) =>
      wrapText[SummaryText](joinText(messageText("顾客申请退货售后："), showValue(reason)).raw)
    case AfterSalesTicketSummaryMessage.CompensationRequest(reason, expectedCompensationCents) =>
      val amountText = expectedCompensationCents.map(formatBusinessCurrency).getOrElse(compensationAmountMissing)
      wrapText[SummaryText](joinText(messageText("顾客申请赔偿售后（期望 "), amountText, messageText("）："), showValue(reason)).raw)

def renderReviewTicketSummary(message: ReviewTicketSummaryMessage): SummaryText =
  message match
    case ReviewTicketSummaryMessage.Positive(customerName, storeName, detail) =>
      wrapText[SummaryText](trimText(joinText(showValue(customerName), messageText(" 对 "), storeName, messageText(" 给出好评。"), detail)).raw)
    case ReviewTicketSummaryMessage.Negative(customerName, detail) =>
      wrapText[SummaryText](trimText(joinText(showValue(customerName), messageText(" 提交了差评。"), detail)).raw)
    case ReviewTicketSummaryMessage.DeliveryIssue(customerName, detail) =>
      wrapText[SummaryText](trimText(joinText(showValue(customerName), messageText(" 反馈配送异常。"), detail)).raw)
