package domain.shared

import domain.shared.given

object DeliveryValidationDefaults:
  val MerchantNameMaxLength: EntityCount = 40
  val StoreNameMaxLength: EntityCount = 40
  val StoreCategoryMaxLength: EntityCount = 20
  val NoteMaxLength: EntityCount = 160
  val ImageUrlMaxLength: EntityCount = 500

  val MenuItemNameMaxLength: EntityCount = 40
  val MenuItemDescriptionMaxLength: EntityCount = 160
  val MenuItemImageUrlMaxLength: EntityCount = 500
  val MenuItemPriceMinCentsExclusive: CurrencyCents = NumericDefaults.ZeroCurrencyCents
  val MenuItemPriceMaxCents: CurrencyCents = 999999
  val MenuItemQuantityMin: Quantity = 1
  val MenuItemStockMin: Quantity = NumericDefaults.ZeroQuantity
  val MenuItemStockMax: Quantity = 10
  val PrepMinutesMin: Minutes = 1
  val PrepMinutesMax: Minutes = 120

  val ReviewRatingMin: RatingValue = 1
  val ReviewRatingMax: RatingValue = 5
  val ReviewCommentMaxLength: EntityCount = 160
  val ReviewExtraNoteMaxLength: EntityCount = 240
  val ReviewApplicationNoteMaxLength: EntityCount = 120

  val OpenCloseTimeLength: EntityCount = 5
  val CustomerNameMaxLength: EntityCount = 30
  val AddressLabelMaxLength: EntityCount = 20
  val AddressMaxLength: EntityCount = 120
  val OrderRemarkMaxLength: EntityCount = 120
  val ContactPhoneMaxLength: EntityCount = 20
  val ContactPhoneMinLength: EntityCount = 6
  val PayoutAccountHolderMaxLength: EntityCount = 30
  val PayoutAccountNumberMaxLength: EntityCount = 60
  val BankNameMaxLength: EntityCount = 30
  val BankAccountNumberMinLength: EntityCount = 8
  val BankAccountNumberMaxLength: EntityCount = 30
  val AlipayAccountMinLength: EntityCount = 4

  val OrderChatMessageMaxLength: EntityCount = 240
  val OrderReasonMaxLength: EntityCount = 160
  val TicketResolutionMaxLength: EntityCount = 60

  val RechargeAmountMinCentsExclusive: CurrencyCents = NumericDefaults.ZeroCurrencyCents
  val RechargeAmountMaxCents: CurrencyCents = 500000
  val WithdrawAmountMinCentsExclusive: CurrencyCents = NumericDefaults.ZeroCurrencyCents
  val WithdrawAmountMaxCents: CurrencyCents = 5000000
  val CompensationAmountMinCentsExclusive: CurrencyCents = NumericDefaults.ZeroCurrencyCents

object DeliveryBusinessDefaults:
  final case class CouponTemplate(
      title: DisplayText,
      discountCents: CurrencyCents,
      minimumSpendCents: CurrencyCents,
      description: DescriptionText,
  )

  val OneStarRevocationThreshold: EntityCount = 50
  val CustomerBanThreshold: EntityCount = 5
  val MemberMonthlySpendThresholdCents: CurrencyCents = 100000
  val StandardAutoDispatchMinutes: DurationDays = 15L
  val MemberAutoDispatchMinutes: DurationDays = 8L
  val MonthlyWindowDays: DurationDays = 30L
  val ReviewWindowDays: DurationDays = 10L
  val MinimumScheduledLeadMinutes: DurationDays = 30L
  val DeliveryFeeCents: CurrencyCents = 1000
  val RiderEarningPerOrderCents: CurrencyCents = 500
  val MerchantRevenueShareNumerator: EntityCount = 70
  val MerchantRevenueShareDenominator: EntityCount = 100
  val StoreOpenStatus: DisplayText = new DisplayText("Open")
  val StoreBusyStatus: DisplayText = new DisplayText("Busy")
  val StoreRevokedStatus: DisplayText = new DisplayText("Revoked")
  val RiderAvailableStatus: AvailabilityLabel = new AvailabilityLabel("Available")
  val RiderOnDeliveryStatus: AvailabilityLabel = new AvailabilityLabel("OnDelivery")
  val RiderSuspendedStatus: AvailabilityLabel = new AvailabilityLabel("Suspended")
  val OrderIdPrefix: DisplayText = new DisplayText("ord")
  val MerchantAcceptedTimelineNote: DisplayText = new DisplayText("商家已接单，开始备餐")
  val MerchantPreparedTimelineNote: DisplayText = new DisplayText("商家已完成备餐，等待骑手取餐")
  val RiderPickedUpTimelineNote: DisplayText = new DisplayText("骑手已取餐，订单配送中")
  val RiderDeliveredTimelineNote: DisplayText = new DisplayText("骑手已确认送达")
  val CouponSpendStepCents: CurrencyCents = 10000
  val CouponValidityDays: DurationDays = 30L
  val MemberTierCouponValidityDays: DurationDays = 14L
  val WelcomeCouponCount: EntityCount = 3
  val WelcomeCouponTemplate: CouponTemplate =
    CouponTemplate(new DisplayText("新人满70减8"), 800, 7000, new DescriptionText("新用户注册礼券，下单满 70 元可用"))
  val MemberTierCouponTemplate: CouponTemplate =
    CouponTemplate(new DisplayText("会员极速配送券"), 1200, 6000, new DescriptionText("近 30 天消费达标会员礼包，可配合更快派单"))
  val SpendRewardCouponTemplates: List[CouponTemplate] = List(
    CouponTemplate(new DisplayText("满30减3"), 300, 3000, new DescriptionText("累计消费奖励券，适合搭配早餐或饮品订单")),
    CouponTemplate(new DisplayText("满50减6"), 600, 5000, new DescriptionText("累计消费奖励券，适合工作日午餐使用")),
    CouponTemplate(new DisplayText("满70减8"), 800, 7000, new DescriptionText("累计消费奖励券，适合常规正餐订单")),
    CouponTemplate(new DisplayText("满100减12"), 1200, 10000, new DescriptionText("累计消费奖励券，适合多人拼单或大额订单")),
    CouponTemplate(new DisplayText("满120减15"), 1500, 12000, new DescriptionText("累计消费奖励券，单张优惠力度不超过 85 折")),
  )
  val CustomerAliasLength: EntityCount = 5
  val GeneratedIdSuffixLength: EntityCount = 8
  val MerchantIdPrefix: DisplayText = new DisplayText("merchant")
  val RiderIdPrefix: DisplayText = new DisplayText("rider")
