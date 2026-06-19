package system.app

// Business note: coupon projection rules for derived customer state.
import system.objects.given

import services.customer.objects.*
import services.order.objects.*
import system.objects.*

import java.time.Instant

def couponsForCustomer(
    customerId: CustomerId,
    membershipTier: MembershipTier,
    existingCoupons: List[Coupon],
    refundedCoupons: List[Coupon],
    completedOrders: List[OrderSummary],
    currentTime: IsoDateTime,
): List[Coupon] =
  val activeCoupons =
    existingCoupons.filterNot(coupon => isCouponExpired(coupon, currentTime))
  val activeRefundedCoupons =
    refundedCoupons.filterNot(coupon => isCouponExpired(coupon, currentTime))
  val spendRewardCoupons =
    spendingRewardCoupons(customerId, completedOrders, currentTime)
  val tierCoupons = membershipTier match
    case MembershipTier.Member =>
      val template = MemberTierCouponTemplate
      List(
        Coupon(
          id = new CouponId(List("coupon-", customerId, "-monthly").mkString),
          title = template.title,
          discountCents = template.discountCents,
          minimumSpendCents = template.minimumSpendCents,
          description = template.description,
          expiresAt = new IsoDateTime(
            Instant
              .parse(currentTime.raw)
              .plusSeconds(MemberTierCouponValidityDays * TimeDefaults.SecondsPerDay)
              .toString,
          ),
        ),
      )
    case MembershipTier.Standard => List.empty

  (activeCoupons ++ activeRefundedCoupons ++ spendRewardCoupons ++ tierCoupons)
    .groupBy(_.id)
    .values
    .map(_.head)
    .toList
    .sortBy(_.expiresAt)

def initialRegistrationCoupons(
    customerId: CustomerId,
    currentTime: IsoDateTime,
): List[Coupon] =
  List.tabulate(WelcomeCouponCount) { index =>
    val template = WelcomeCouponTemplate
    Coupon(
      id = new CouponId(
        List(
          "coupon-",
          customerId,
          "-welcome-",
          index + NumericDefaults.SingleItemCount,
        ).mkString
      ),
      title = template.title,
      discountCents = template.discountCents,
      minimumSpendCents = template.minimumSpendCents,
      description = template.description,
      expiresAt = new IsoDateTime(
        Instant
          .parse(currentTime.raw)
          .plusSeconds(CouponValidityDays * TimeDefaults.SecondsPerDay)
          .toString,
      ),
    )
  }

def spendingRewardCoupons(
    customerId: CustomerId,
    completedOrders: List[OrderSummary],
    currentTime: IsoDateTime,
): List[Coupon] =
  val (_, _, issuedCoupons) = completedOrders.foldLeft(
    (NumericDefaults.ZeroCurrencyCents, NumericDefaults.ZeroCount, List.empty[Coupon]),
  ) {
    case ((accumulatedSpendCents, issuedCount, rewardCoupons), order) =>
      val nextAccumulatedSpendCents = accumulatedSpendCents + order.totalPriceCents
      val nextIssuedCount: EntityCount = nextAccumulatedSpendCents / CouponSpendStepCents
      if nextIssuedCount <= issuedCount then
        (nextAccumulatedSpendCents, issuedCount, rewardCoupons)
      else
        val newCoupons = (issuedCount.raw until nextIssuedCount.raw).toList.map {
          rewardIndex =>
            val template =
              SpendRewardCouponTemplates(rewardIndex % SpendRewardCouponTemplates.length)
            val issuedAt = parseInstant(reviewEligibilityTimestamp(order))
              .getOrElse(Instant.parse(currentTime.raw))
            Coupon(
              id = new CouponId(
                List(
                  "coupon-",
                  customerId,
                  "-spend-",
                  rewardIndex + NumericDefaults.SingleItemCount,
                ).mkString
              ),
              title = template.title,
              discountCents = template.discountCents,
              minimumSpendCents = template.minimumSpendCents,
              description = template.description,
              expiresAt = new IsoDateTime(
                issuedAt
                  .plusSeconds(CouponValidityDays * TimeDefaults.SecondsPerDay)
                  .toString,
              ),
            )
        }
        (nextAccumulatedSpendCents, nextIssuedCount, rewardCoupons ++ newCoupons)
  }
  issuedCoupons.filterNot(coupon => isCouponExpired(coupon, currentTime))

def isCouponExpired(coupon: Coupon, currentTime: IsoDateTime): ApprovalFlag =
  new ApprovalFlag(parseInstant(coupon.expiresAt).exists(_.isBefore(Instant.parse(currentTime.raw))))
