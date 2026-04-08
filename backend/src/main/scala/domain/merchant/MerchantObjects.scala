package domain.merchant

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import domain.shared.MerchantApplicationStatus

final case class MenuItem(
    id: String,
    name: String,
    description: String,
    priceCents: Int,
    imageUrl: Option[String],
    remainingQuantity: Option[Int],
)
object MenuItem:
  given Encoder[MenuItem] = deriveEncoder
  given Decoder[MenuItem] = Decoder.instance { cursor =>
    for
      id <- cursor.get[String]("id")
      name <- cursor.get[String]("name")
      description <- cursor.get[String]("description")
      priceCents <- cursor.get[Int]("priceCents")
      imageUrl <- cursor.get[Option[String]]("imageUrl")
      remainingQuantity <- cursor.getOrElse[Option[Int]]("remainingQuantity")(None)
    yield MenuItem(
      id = id,
      name = name,
      description = description,
      priceCents = priceCents,
      imageUrl = imageUrl,
      remainingQuantity = remainingQuantity,
    )
  }

final case class BusinessHours(
    openTime: String,
    closeTime: String,
)
object BusinessHours:
  val DefaultOpenTime: String = "09:00"
  val DefaultCloseTime: String = "21:00"
  val Default: BusinessHours = BusinessHours(DefaultOpenTime, DefaultCloseTime)
  given Encoder[BusinessHours] = deriveEncoder
  given Decoder[BusinessHours] = deriveDecoder

enum MerchantPayoutAccountType:
  case Alipay, Bank

object MerchantPayoutAccountType:
  private val AlipayValue = "alipay"
  private val BankValue = "bank"
  val LegacyAlipayPrefix: String = "支付宝"
  val BankLabel: String = "银行卡"

  def fromSerialized(value: String): Either[String, MerchantPayoutAccountType] =
    value.trim.toLowerCase match
      case AlipayValue => Right(MerchantPayoutAccountType.Alipay)
      case BankValue => Right(MerchantPayoutAccountType.Bank)
      case other => Left(s"Invalid MerchantPayoutAccountType: $other")

  def serialize(value: MerchantPayoutAccountType): String =
    value match
      case MerchantPayoutAccountType.Alipay => AlipayValue
      case MerchantPayoutAccountType.Bank => BankValue

  given Encoder[MerchantPayoutAccountType] = Encoder.encodeString.contramap(serialize)
  given Decoder[MerchantPayoutAccountType] = Decoder.decodeString.emap(fromSerialized)

final case class Store(
    id: String,
    merchantName: String,
    name: String,
    category: String,
    cuisine: String,
    status: String,
    businessHours: BusinessHours,
    avgPrepMinutes: Int,
    imageUrl: Option[String],
    menu: List[MenuItem],
    averageRating: Double,
    ratingCount: Int,
    oneStarRatingCount: Int,
    revenueCents: Int,
 )
object Store:
  given Encoder[Store] = deriveEncoder
  given Decoder[Store] = Decoder.instance { cursor =>
    for
      id <- cursor.get[String]("id")
      merchantName <- cursor.get[String]("merchantName")
      name <- cursor.get[String]("name")
      category <- cursor.get[String]("category")
      cuisine <- cursor.get[String]("cuisine")
      status <- cursor.get[String]("status")
      businessHours <- cursor.getOrElse[BusinessHours]("businessHours")(BusinessHours.Default)
      avgPrepMinutes <- cursor.get[Int]("avgPrepMinutes")
      imageUrl <- cursor.get[Option[String]]("imageUrl")
      menu <- cursor.getOrElse[List[MenuItem]]("menu")(List.empty)
      averageRating <- cursor.getOrElse[Double]("averageRating")(0.0)
      ratingCount <- cursor.getOrElse[Int]("ratingCount")(0)
      oneStarRatingCount <- cursor.getOrElse[Int]("oneStarRatingCount")(0)
      revenueCents <- cursor.getOrElse[Int]("revenueCents")(0)
    yield Store(
      id = id,
      merchantName = merchantName,
      name = name,
      category = category,
      cuisine = cuisine,
      status = status,
      businessHours = businessHours,
      avgPrepMinutes = avgPrepMinutes,
      imageUrl = imageUrl,
      menu = menu,
      averageRating = averageRating,
      ratingCount = ratingCount,
      oneStarRatingCount = oneStarRatingCount,
      revenueCents = revenueCents,
    )
  }

final case class MerchantWithdrawal(
    id: String,
    amountCents: Int,
    accountLabel: String,
    requestedAt: String,
)
object MerchantWithdrawal:
  given Encoder[MerchantWithdrawal] = deriveEncoder
  given Decoder[MerchantWithdrawal] = deriveDecoder

final case class MerchantPayoutAccount(
    accountType: MerchantPayoutAccountType,
    bankName: Option[String],
    accountNumber: String,
    accountHolder: String,
)
object MerchantPayoutAccount:
  given Encoder[MerchantPayoutAccount] = deriveEncoder
  given Decoder[MerchantPayoutAccount] = Decoder.instance { cursor =>
    for
      accountType <- cursor.get[MerchantPayoutAccountType]("accountType")
      bankName <- cursor.get[Option[String]]("bankName")
      accountNumber <- cursor.getOrElse[String]("accountNumber")("")
      accountHolder <- cursor.getOrElse[String]("accountHolder")("")
    yield MerchantPayoutAccount(
      accountType = accountType,
      bankName = bankName,
      accountNumber = accountNumber,
      accountHolder = accountHolder,
    )
  }

  def fromLegacy(value: String): Option[MerchantPayoutAccount] =
    val legacy = value.trim
    if legacy.isEmpty then None
    else if legacy.startsWith(MerchantPayoutAccountType.LegacyAlipayPrefix) then
      Some(
        MerchantPayoutAccount(
          accountType = MerchantPayoutAccountType.Alipay,
          bankName = None,
          accountNumber = legacy.stripPrefix(MerchantPayoutAccountType.LegacyAlipayPrefix).trim,
          accountHolder = "",
        )
      )
    else
      Some(
        MerchantPayoutAccount(
          accountType = MerchantPayoutAccountType.Bank,
          bankName = legacy.split(" ").headOption.filter(_.nonEmpty),
          accountNumber = legacy,
          accountHolder = "",
        )
      )

final case class MerchantProfile(
    id: String,
    merchantName: String,
    contactPhone: String,
    payoutAccount: Option[MerchantPayoutAccount],
    settledIncomeCents: Int,
    withdrawnCents: Int,
    availableToWithdrawCents: Int,
    withdrawalHistory: List[MerchantWithdrawal],
 )
object MerchantProfile:
  given Encoder[MerchantProfile] = deriveEncoder
  given Decoder[MerchantProfile] = Decoder.instance { cursor =>
    for
      id <- cursor.get[String]("id")
      merchantName <- cursor.get[String]("merchantName")
      contactPhone <- cursor.getOrElse[String]("contactPhone")("")
      payoutAccount <- cursor.get[Option[MerchantPayoutAccount]]("payoutAccount").orElse(
        cursor.get[Option[String]]("payoutAccount").map(_.flatMap(MerchantPayoutAccount.fromLegacy))
      )
      settledIncomeCents <- cursor.getOrElse[Int]("settledIncomeCents")(0)
      withdrawnCents <- cursor.getOrElse[Int]("withdrawnCents")(0)
      availableToWithdrawCents <- cursor.getOrElse[Int]("availableToWithdrawCents")(Math.max(0, settledIncomeCents - withdrawnCents))
      withdrawalHistory <- cursor.getOrElse[List[MerchantWithdrawal]]("withdrawalHistory")(List.empty)
    yield MerchantProfile(
      id = id,
      merchantName = merchantName,
      contactPhone = contactPhone,
      payoutAccount = payoutAccount,
      settledIncomeCents = settledIncomeCents,
      withdrawnCents = withdrawnCents,
      availableToWithdrawCents = availableToWithdrawCents,
      withdrawalHistory = withdrawalHistory,
    )
  }

final case class MerchantApplication(
    id: String,
    merchantName: String,
    storeName: String,
    category: String,
    businessHours: BusinessHours,
    avgPrepMinutes: Int,
    imageUrl: Option[String],
    note: Option[String],
    status: MerchantApplicationStatus,
    reviewNote: Option[String],
    submittedAt: String,
    reviewedAt: Option[String],
 )
object MerchantApplication:
  given Encoder[MerchantApplication] = deriveEncoder
  given Decoder[MerchantApplication] = Decoder.instance { cursor =>
    for
      id <- cursor.get[String]("id")
      merchantName <- cursor.get[String]("merchantName")
      storeName <- cursor.get[String]("storeName")
      category <- cursor.get[String]("category")
      businessHours <- cursor.getOrElse[BusinessHours]("businessHours")(BusinessHours.Default)
      avgPrepMinutes <- cursor.get[Int]("avgPrepMinutes")
      imageUrl <- cursor.get[Option[String]]("imageUrl")
      note <- cursor.get[Option[String]]("note")
      status <- cursor.get[MerchantApplicationStatus]("status")
      reviewNote <- cursor.get[Option[String]]("reviewNote")
      submittedAt <- cursor.get[String]("submittedAt")
      reviewedAt <- cursor.get[Option[String]]("reviewedAt")
    yield MerchantApplication(
      id = id,
      merchantName = merchantName,
      storeName = storeName,
      category = category,
      businessHours = businessHours,
      avgPrepMinutes = avgPrepMinutes,
      imageUrl = imageUrl,
      note = note,
      status = status,
      reviewNote = reviewNote,
      submittedAt = submittedAt,
      reviewedAt = reviewedAt,
    )
  }

final case class UpdateMerchantProfileRequest(
    contactPhone: String,
    payoutAccount: MerchantPayoutAccount,
)
object UpdateMerchantProfileRequest:
  given Encoder[UpdateMerchantProfileRequest] = deriveEncoder
  given Decoder[UpdateMerchantProfileRequest] = deriveDecoder

final case class WithdrawMerchantIncomeRequest(amountCents: Int)
object WithdrawMerchantIncomeRequest:
  given Encoder[WithdrawMerchantIncomeRequest] = deriveEncoder
  given Decoder[WithdrawMerchantIncomeRequest] = deriveDecoder

final case class MerchantRegistrationRequest(
    merchantName: String,
    storeName: String,
    category: String,
    businessHours: BusinessHours,
    avgPrepMinutes: Int,
    imageUrl: Option[String],
    note: Option[String],
 )
object MerchantRegistrationRequest:
  given Encoder[MerchantRegistrationRequest] = deriveEncoder
  given Decoder[MerchantRegistrationRequest] = deriveDecoder

final case class AddMenuItemRequest(
    name: String,
    description: String,
    priceCents: Int,
    imageUrl: Option[String],
    remainingQuantity: Option[Int],
)
object AddMenuItemRequest:
  given Encoder[AddMenuItemRequest] = deriveEncoder
  given Decoder[AddMenuItemRequest] = deriveDecoder

final case class UpdateMenuItemStockRequest(
    remainingQuantity: Option[Int],
)
object UpdateMenuItemStockRequest:
  given Encoder[UpdateMenuItemStockRequest] = deriveEncoder
  given Decoder[UpdateMenuItemStockRequest] = deriveDecoder

final case class UpdateStoreOperationalRequest(
    businessHours: BusinessHours,
    avgPrepMinutes: Int,
 )
object UpdateStoreOperationalRequest:
  given Encoder[UpdateStoreOperationalRequest] = deriveEncoder
  given Decoder[UpdateStoreOperationalRequest] = deriveDecoder

final case class ReviewMerchantApplicationRequest(reviewNote: String)
object ReviewMerchantApplicationRequest:
  given Encoder[ReviewMerchantApplicationRequest] = deriveEncoder
  given Decoder[ReviewMerchantApplicationRequest] = deriveDecoder

final case class ImageUploadResponse(url: String)
object ImageUploadResponse:
  given Encoder[ImageUploadResponse] = deriveEncoder
  given Decoder[ImageUploadResponse] = deriveDecoder
