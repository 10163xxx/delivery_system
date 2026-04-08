package domain.rider

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import domain.merchant.{MerchantPayoutAccount, MerchantWithdrawal}

final case class Rider(
    id: String,
    name: String,
    vehicle: String,
    zone: String,
    availability: String,
    averageRating: Double,
    ratingCount: Int,
    oneStarRatingCount: Int,
    earningsCents: Int,
    payoutAccount: Option[MerchantPayoutAccount],
    withdrawnCents: Int,
    availableToWithdrawCents: Int,
    withdrawalHistory: List[MerchantWithdrawal],
)
object Rider:
  given Encoder[Rider] = deriveEncoder
  given Decoder[Rider] = Decoder.instance { cursor =>
    for
      id <- cursor.get[String]("id")
      name <- cursor.get[String]("name")
      vehicle <- cursor.get[String]("vehicle")
      zone <- cursor.get[String]("zone")
      availability <- cursor.get[String]("availability")
      averageRating <- cursor.get[Double]("averageRating")
      ratingCount <- cursor.get[Int]("ratingCount")
      oneStarRatingCount <- cursor.get[Int]("oneStarRatingCount")
      earningsCents <- cursor.getOrElse[Int]("earningsCents")(0)
      payoutAccount <- cursor.get[Option[MerchantPayoutAccount]]("payoutAccount").orElse(
        cursor.get[Option[String]]("payoutAccount").map(_.flatMap(MerchantPayoutAccount.fromLegacy))
      )
      withdrawnCents <- cursor.getOrElse[Int]("withdrawnCents")(0)
      availableToWithdrawCents <- cursor.getOrElse[Int]("availableToWithdrawCents")(Math.max(0, earningsCents - withdrawnCents))
      withdrawalHistory <- cursor.getOrElse[List[MerchantWithdrawal]]("withdrawalHistory")(List.empty)
    yield Rider(
      id = id,
      name = name,
      vehicle = vehicle,
      zone = zone,
      availability = availability,
      averageRating = averageRating,
      ratingCount = ratingCount,
      oneStarRatingCount = oneStarRatingCount,
      earningsCents = earningsCents,
      payoutAccount = payoutAccount,
      withdrawnCents = withdrawnCents,
      availableToWithdrawCents = availableToWithdrawCents,
      withdrawalHistory = withdrawalHistory,
    )
  }

final case class UpdateRiderProfileRequest(
    payoutAccount: MerchantPayoutAccount,
)
object UpdateRiderProfileRequest:
  given Encoder[UpdateRiderProfileRequest] = deriveEncoder
  given Decoder[UpdateRiderProfileRequest] = deriveDecoder

final case class WithdrawRiderIncomeRequest(amountCents: Int)
object WithdrawRiderIncomeRequest:
  given Encoder[WithdrawRiderIncomeRequest] = deriveEncoder
  given Decoder[WithdrawRiderIncomeRequest] = deriveDecoder
