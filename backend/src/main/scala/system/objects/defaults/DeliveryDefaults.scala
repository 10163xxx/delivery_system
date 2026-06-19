package system.objects

import system.objects.given
import services.rider.objects.*

object DeliveryValidationDefaults:
  val MerchantNameMaxLength: EntityCount = new EntityCount(40)
  val StoreNameMaxLength: EntityCount = new EntityCount(40)
  val StoreCategoryMaxLength: EntityCount = new EntityCount(20)
  val NoteMaxLength: EntityCount = new EntityCount(160)
  val ImageUrlMaxLength: EntityCount = new EntityCount(500)

  val MenuItemNameMaxLength: EntityCount = new EntityCount(40)
  val MenuItemCategoryMaxLength: EntityCount = new EntityCount(20)
  val MenuItemDescriptionMaxLength: EntityCount = new EntityCount(160)
  val MenuItemImageUrlMaxLength: EntityCount = new EntityCount(500)
  val MenuItemSelectionGroupNameMaxLength: EntityCount = new EntityCount(20)
  val MenuItemSelectionOptionMaxLength: EntityCount = new EntityCount(20)
  val MenuItemSelectionGroupMaxCount: EntityCount = new EntityCount(6)
  val MenuItemSelectionOptionMaxCount: EntityCount = new EntityCount(8)
  val MenuItemPriceMinCentsExclusive: CurrencyCents = NumericDefaults.ZeroCurrencyCents
  val MenuItemPriceMaxCents: CurrencyCents = new CurrencyCents(999999)
  val MenuItemQuantityMin: Quantity = new Quantity(1)
  val MenuItemStockMin: Quantity = NumericDefaults.ZeroQuantity
  val MenuItemStockMax: Quantity = new Quantity(10)
  val PrepMinutesMin: Minutes = new Minutes(1)
  val PrepMinutesMax: Minutes = new Minutes(120)

  val ReviewRatingMin: RatingValue = new RatingValue(1)
  val ReviewRatingMax: RatingValue = new RatingValue(5)
  val ReviewCommentMaxLength: EntityCount = new EntityCount(160)
  val ReviewExtraNoteMaxLength: EntityCount = new EntityCount(240)
  val ReviewApplicationNoteMaxLength: EntityCount = new EntityCount(120)

  val OpenCloseTimeLength: EntityCount = new EntityCount(5)
  val CustomerNameMaxLength: EntityCount = new EntityCount(30)
  val AddressLabelMaxLength: EntityCount = new EntityCount(20)
  val AddressMaxLength: EntityCount = new EntityCount(120)
  val OrderRemarkMaxLength: EntityCount = new EntityCount(120)
  val ContactPhoneMaxLength: EntityCount = new EntityCount(20)
  val ContactPhoneMinLength: EntityCount = new EntityCount(6)
  val PayoutAccountHolderMaxLength: EntityCount = new EntityCount(30)
  val PayoutAccountNumberMaxLength: EntityCount = new EntityCount(60)
  val BankNameMaxLength: EntityCount = new EntityCount(30)
  val BankAccountNumberMinLength: EntityCount = new EntityCount(8)
  val BankAccountNumberMaxLength: EntityCount = new EntityCount(30)
  val AlipayAccountMinLength: EntityCount = new EntityCount(4)

  val OrderChatMessageMaxLength: EntityCount = new EntityCount(240)
  val OrderReasonMaxLength: EntityCount = new EntityCount(160)
  val TicketResolutionMaxLength: EntityCount = new EntityCount(60)

  val RechargeAmountMinCentsExclusive: CurrencyCents = NumericDefaults.ZeroCurrencyCents
  val RechargeAmountMaxCents: CurrencyCents = new CurrencyCents(500000)
  val WithdrawAmountMinCentsExclusive: CurrencyCents = NumericDefaults.ZeroCurrencyCents
  val WithdrawAmountMaxCents: CurrencyCents = new CurrencyCents(5000000)
  val CompensationAmountMinCentsExclusive: CurrencyCents = NumericDefaults.ZeroCurrencyCents

object DeliveryBusinessDefaults:
  final case class CouponTemplate(
      title: DisplayText,
      discountCents: CurrencyCents,
      minimumSpendCents: CurrencyCents,
      description: DescriptionText,
  )

  val OneStarRevocationThreshold: EntityCount = new EntityCount(50)
  val CustomerBanThreshold: EntityCount = new EntityCount(5)
  val MemberMonthlySpendThresholdCents: CurrencyCents = new CurrencyCents(100000)
  val StandardAutoDispatchMinutes: DurationDays = new DurationDays(15L)
  val MemberAutoDispatchMinutes: DurationDays = new DurationDays(8L)
  val MonthlyWindowDays: DurationDays = new DurationDays(30L)
  val ReviewWindowDays: DurationDays = new DurationDays(10L)
  val MinimumScheduledLeadMinutes: DurationDays = new DurationDays(30L)
  val DeliveryFeeCents: CurrencyCents = new CurrencyCents(1000)
  val RiderEarningPerOrderCents: CurrencyCents = new CurrencyCents(500)
  val MerchantRevenueShareNumerator: EntityCount = new EntityCount(70)
  val MerchantRevenueShareDenominator: EntityCount = new EntityCount(100)
  val StoreOpenStatus: DisplayText = new DisplayText("Open")
  val StoreBusyStatus: DisplayText = new DisplayText("Busy")
  val StoreRevokedStatus: DisplayText = new DisplayText("Revoked")
  val RiderAvailableStatus: AvailabilityLabel = new AvailabilityLabel("Available")
  val RiderOnDeliveryStatus: AvailabilityLabel = new AvailabilityLabel("OnDelivery")
  val RiderUnavailableStatus: AvailabilityLabel = new AvailabilityLabel("Unavailable")
  val RiderSuspendedStatus: AvailabilityLabel = new AvailabilityLabel("Suspended")
  val OrderIdPrefix: DisplayText = new DisplayText("ord")
  val MerchantAcceptedTimelineNote: DisplayText = new DisplayText("商家已接单，开始备餐")
  val MerchantPreparedTimelineNote: DisplayText = new DisplayText("商家已完成备餐，等待骑手取餐")
  val RiderPickedUpTimelineNote: DisplayText = new DisplayText("骑手已取餐，订单配送中")
  val RiderDeliveredTimelineNote: DisplayText = new DisplayText("骑手已确认送达")
  val CouponSpendStepCents: CurrencyCents = new CurrencyCents(10000)
  val CouponValidityDays: DurationDays = new DurationDays(30L)
  val MemberTierCouponValidityDays: DurationDays = new DurationDays(14L)
  val WelcomeCouponCount: EntityCount = new EntityCount(3)
  val WelcomeCouponTemplate: CouponTemplate =
    CouponTemplate(new DisplayText("新人满70减8"), new CurrencyCents(800), new CurrencyCents(7000), new DescriptionText("新用户注册礼券，下单满 70 元可用"))
  val MemberTierCouponTemplate: CouponTemplate =
    CouponTemplate(new DisplayText("会员极速配送券"), new CurrencyCents(1200), new CurrencyCents(6000), new DescriptionText("近 30 天消费达标会员礼包，可配合更快派单"))
  val SpendRewardCouponTemplates: List[CouponTemplate] = List(
    CouponTemplate(new DisplayText("满30减3"), new CurrencyCents(300), new CurrencyCents(3000), new DescriptionText("累计消费奖励券，适合搭配早餐或饮品订单")),
    CouponTemplate(new DisplayText("满50减6"), new CurrencyCents(600), new CurrencyCents(5000), new DescriptionText("累计消费奖励券，适合工作日午餐使用")),
    CouponTemplate(new DisplayText("满70减8"), new CurrencyCents(800), new CurrencyCents(7000), new DescriptionText("累计消费奖励券，适合常规正餐订单")),
    CouponTemplate(new DisplayText("满100减12"), new CurrencyCents(1200), new CurrencyCents(10000), new DescriptionText("累计消费奖励券，适合多人拼单或大额订单")),
    CouponTemplate(new DisplayText("满120减15"), new CurrencyCents(1500), new CurrencyCents(12000), new DescriptionText("累计消费奖励券，单张优惠力度不超过 85 折")),
  )
  val CustomerAliasLength: EntityCount = new EntityCount(5)
  val GeneratedIdSuffixLength: EntityCount = new EntityCount(8)
  val MerchantIdPrefix: DisplayText = new DisplayText("merchant")
  val RiderIdPrefix: DisplayText = new DisplayText("rider")
