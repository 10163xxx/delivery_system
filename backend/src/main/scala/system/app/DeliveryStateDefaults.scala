package system.app

// Business note: application-level business orchestration and derived state shared by service actions.
import system.objects.*

import java.time.ZoneId

// Public aliases for delivery business defaults used by action and validation modules.
val OneStarRevocationThreshold = DeliveryBusinessDefaults.OneStarRevocationThreshold
val CustomerBanThreshold = DeliveryBusinessDefaults.CustomerBanThreshold
val MemberMonthlySpendThresholdCents = DeliveryBusinessDefaults.MemberMonthlySpendThresholdCents
val StandardAutoDispatchMinutes = DeliveryBusinessDefaults.StandardAutoDispatchMinutes
val MemberAutoDispatchMinutes = DeliveryBusinessDefaults.MemberAutoDispatchMinutes
val MonthlyWindowDays = DeliveryBusinessDefaults.MonthlyWindowDays
val ReviewWindowDays = DeliveryBusinessDefaults.ReviewWindowDays
val MinimumScheduledLeadMinutes = DeliveryBusinessDefaults.MinimumScheduledLeadMinutes
val DeliveryFeeCents = DeliveryBusinessDefaults.DeliveryFeeCents
val RiderEarningPerOrderCents = DeliveryBusinessDefaults.RiderEarningPerOrderCents
val MerchantRevenueShareNumerator = DeliveryBusinessDefaults.MerchantRevenueShareNumerator
val MerchantRevenueShareDenominator = DeliveryBusinessDefaults.MerchantRevenueShareDenominator
val StoreOpenStatus = DeliveryBusinessDefaults.StoreOpenStatus
val StoreBusyStatus = DeliveryBusinessDefaults.StoreBusyStatus
val StoreRevokedStatus = DeliveryBusinessDefaults.StoreRevokedStatus
val RiderAvailableStatus = DeliveryBusinessDefaults.RiderAvailableStatus
val RiderOnDeliveryStatus = DeliveryBusinessDefaults.RiderOnDeliveryStatus
val RiderUnavailableStatus = DeliveryBusinessDefaults.RiderUnavailableStatus
val RiderSuspendedStatus = DeliveryBusinessDefaults.RiderSuspendedStatus
val OrderIdPrefix = DeliveryBusinessDefaults.OrderIdPrefix
val MerchantAcceptedTimelineNote = DeliveryBusinessDefaults.MerchantAcceptedTimelineNote
val MerchantPreparedTimelineNote = DeliveryBusinessDefaults.MerchantPreparedTimelineNote
val RiderPickedUpTimelineNote = DeliveryBusinessDefaults.RiderPickedUpTimelineNote
val RiderDeliveredTimelineNote = DeliveryBusinessDefaults.RiderDeliveredTimelineNote
val CouponSpendStepCents = DeliveryBusinessDefaults.CouponSpendStepCents
val CouponValidityDays = DeliveryBusinessDefaults.CouponValidityDays
val MemberTierCouponValidityDays = DeliveryBusinessDefaults.MemberTierCouponValidityDays
val WelcomeCouponCount = DeliveryBusinessDefaults.WelcomeCouponCount
val WelcomeCouponTemplate = DeliveryBusinessDefaults.WelcomeCouponTemplate
val MemberTierCouponTemplate = DeliveryBusinessDefaults.MemberTierCouponTemplate
val MerchantIdPrefix = DeliveryBusinessDefaults.MerchantIdPrefix
val RiderIdPrefix = DeliveryBusinessDefaults.RiderIdPrefix
val DeliveryScheduleZone = ZoneId.systemDefault()
val StoreCategories = List(
  new DisplayText("中式快餐"),
  new DisplayText("西式快餐"),
  new DisplayText("盖饭简餐"),
  new DisplayText("披萨西餐"),
  new DisplayText("面馆粉档"),
  new DisplayText("麻辣香锅"),
  new DisplayText("饺子馄饨"),
  new DisplayText("轻食沙拉"),
  new DisplayText("咖啡甜点"),
  new DisplayText("奶茶果饮"),
  new DisplayText("夜宵小吃"),
)
val SpendRewardCouponTemplates = DeliveryBusinessDefaults.SpendRewardCouponTemplates
