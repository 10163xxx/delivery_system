package objects

import io.circe.{Decoder, Encoder, Json}
import io.circe.generic.semiauto.*

enum OrderStatus:
  case PendingMerchantAcceptance, Preparing, ReadyForPickup, Delivering, Completed, Cancelled, Escalated

object OrderStatus:
  given Encoder[OrderStatus] = Encoder.encodeString.contramap(_.toString)
  given Decoder[OrderStatus] = Decoder.decodeString.emap { value =>
    OrderStatus.values.find(_.toString == value).toRight(s"Invalid OrderStatus: $value")
  }

enum TicketKind:
  case PositiveReview, NegativeReview, DeliveryIssue

object TicketKind:
  given Encoder[TicketKind] = Encoder.encodeString.contramap(_.toString)
  given Decoder[TicketKind] = Decoder.decodeString.emap { value =>
    TicketKind.values.find(_.toString == value).toRight(s"Invalid TicketKind: $value")
  }

enum TicketStatus:
  case Open, Resolved

object TicketStatus:
  given Encoder[TicketStatus] = Encoder.encodeString.contramap(_.toString)
  given Decoder[TicketStatus] = Decoder.decodeString.emap { value =>
    TicketStatus.values.find(_.toString == value).toRight(s"Invalid TicketStatus: $value")
  }

enum MerchantApplicationStatus:
  case Pending, Approved, Rejected

object MerchantApplicationStatus:
  given Encoder[MerchantApplicationStatus] = Encoder.encodeString.contramap(_.toString)
  given Decoder[MerchantApplicationStatus] = Decoder.decodeString.emap { value =>
    MerchantApplicationStatus.values.find(_.toString == value).toRight(s"Invalid MerchantApplicationStatus: $value")
  }

enum AccountStatus:
  case Active, Suspended

object AccountStatus:
  given Encoder[AccountStatus] = Encoder.encodeString.contramap(_.toString)
  given Decoder[AccountStatus] = Decoder.decodeString.emap { value =>
    AccountStatus.values.find(_.toString == value).toRight(s"Invalid AccountStatus: $value")
  }

enum ReviewStatus:
  case Active, Revoked

object ReviewStatus:
  given Encoder[ReviewStatus] = Encoder.encodeString.contramap(_.toString)
  given Decoder[ReviewStatus] = Decoder.decodeString.emap { value =>
    ReviewStatus.values.find(_.toString == value).toRight(s"Invalid ReviewStatus: $value")
  }

enum AppealStatus:
  case Pending, Approved, Rejected

object AppealStatus:
  given Encoder[AppealStatus] = Encoder.encodeString.contramap(_.toString)
  given Decoder[AppealStatus] = Decoder.decodeString.emap { value =>
    AppealStatus.values.find(_.toString == value).toRight(s"Invalid AppealStatus: $value")
  }

enum PartialRefundStatus:
  case Pending, Approved, Rejected

object PartialRefundStatus:
  given Encoder[PartialRefundStatus] = Encoder.encodeString.contramap(_.toString)
  given Decoder[PartialRefundStatus] = Decoder.decodeString.emap { value =>
    PartialRefundStatus.values.find(_.toString == value).toRight(s"Invalid PartialRefundStatus: $value")
  }

enum AppealRole:
  case Merchant, Rider

object AppealRole:
  given Encoder[AppealRole] = Encoder.encodeString.contramap(_.toString)
  given Decoder[AppealRole] = Decoder.decodeString.emap { value =>
    AppealRole.values.find(_.toString == value).toRight(s"Invalid AppealRole: $value")
  }

enum EligibilityReviewTarget:
  case Store, Rider

object EligibilityReviewTarget:
  given Encoder[EligibilityReviewTarget] = Encoder.encodeString.contramap(_.toString)
  given Decoder[EligibilityReviewTarget] = Decoder.decodeString.emap { value =>
    EligibilityReviewTarget.values.find(_.toString == value).toRight(s"Invalid EligibilityReviewTarget: $value")
  }

enum MembershipTier:
  case Standard, Member

object MembershipTier:
  given Encoder[MembershipTier] = Encoder.encodeString.contramap(_.toString)
  given Decoder[MembershipTier] = Decoder.decodeString.emap { value =>
    MembershipTier.values.find(_.toString == value).toRight(s"Invalid MembershipTier: $value")
  }

enum UserRole:
  case customer, merchant, rider, admin

object UserRole:
  given Encoder[UserRole] = Encoder.encodeString.contramap(_.toString)
  given Decoder[UserRole] = Decoder.decodeString.emap { value =>
    UserRole.values.find(_.toString == value).toRight(s"Invalid UserRole: $value")
  }

final case class AddressEntry(label: String, address: String)
object AddressEntry:
  given Encoder[AddressEntry] = deriveEncoder
  given Decoder[AddressEntry] = deriveDecoder

final case class Coupon(
    id: String,
    title: String,
    discountCents: Int,
    minimumSpendCents: Int,
    description: String,
    expiresAt: String,
)
object Coupon:
  given Encoder[Coupon] = deriveEncoder
  given Decoder[Coupon] = deriveDecoder

final case class Customer(
    id: String,
    name: String,
    phone: String,
    defaultAddress: String,
    addresses: List[AddressEntry],
    accountStatus: AccountStatus,
    revokedReviewCount: Int,
    membershipTier: MembershipTier,
    monthlySpendCents: Int,
    balanceCents: Int,
    coupons: List[Coupon],
)
object Customer:
  given Encoder[Customer] = deriveEncoder
  given Decoder[Customer] = deriveDecoder

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
  given Encoder[BusinessHours] = deriveEncoder
  given Decoder[BusinessHours] = deriveDecoder

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
      businessHours <- cursor.getOrElse[BusinessHours]("businessHours")(BusinessHours("09:00", "21:00"))
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

final case class AdminProfile(id: String, name: String)
object AdminProfile:
  given Encoder[AdminProfile] = deriveEncoder
  given Decoder[AdminProfile] = deriveDecoder

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
    accountType: String,
    bankName: Option[String],
    accountNumber: String,
    accountHolder: String,
)
object MerchantPayoutAccount:
  given Encoder[MerchantPayoutAccount] = deriveEncoder
  given Decoder[MerchantPayoutAccount] = Decoder.instance { cursor =>
    for
      accountType <- cursor.getOrElse[String]("accountType")("")
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
    else if legacy.startsWith("支付宝") then
      Some(
        MerchantPayoutAccount(
          accountType = "alipay",
          bankName = None,
          accountNumber = legacy.stripPrefix("支付宝").trim,
          accountHolder = "",
        )
      )
    else
      Some(
        MerchantPayoutAccount(
          accountType = "bank",
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

final case class AuthUser(
    id: String,
    username: String,
    role: UserRole,
    displayName: String,
    linkedProfileId: Option[String],
)
object AuthUser:
  given Encoder[AuthUser] = deriveEncoder
  given Decoder[AuthUser] = deriveDecoder

final case class AuthSessionResponse(token: String, user: AuthUser)
object AuthSessionResponse:
  given Encoder[AuthSessionResponse] = deriveEncoder
  given Decoder[AuthSessionResponse] = deriveDecoder

final case class LoginRequest(username: String, password: String)
object LoginRequest:
  given Encoder[LoginRequest] = deriveEncoder
  given Decoder[LoginRequest] = deriveDecoder

final case class RegisterRequest(
    username: String,
    password: String,
    role: UserRole,
)
object RegisterRequest:
  given Encoder[RegisterRequest] = deriveEncoder
  given Decoder[RegisterRequest] = deriveDecoder

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
      businessHours <- cursor.getOrElse[BusinessHours]("businessHours")(BusinessHours("09:00", "21:00"))
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

final case class OrderItemInput(menuItemId: String, quantity: Int)
object OrderItemInput:
  given Encoder[OrderItemInput] = deriveEncoder
  given Decoder[OrderItemInput] = deriveDecoder

final case class CreateOrderRequest(
    customerId: String,
    storeId: String,
    deliveryAddress: String,
    scheduledDeliveryAt: String,
    remark: Option[String],
    items: List[OrderItemInput],
)
object CreateOrderRequest:
  given Encoder[CreateOrderRequest] = deriveEncoder
  given Decoder[CreateOrderRequest] = deriveDecoder

final case class UpdateCustomerProfileRequest(name: String)
object UpdateCustomerProfileRequest:
  given Encoder[UpdateCustomerProfileRequest] = deriveEncoder
  given Decoder[UpdateCustomerProfileRequest] = deriveDecoder

final case class AddCustomerAddressRequest(label: String, address: String)
object AddCustomerAddressRequest:
  given Encoder[AddCustomerAddressRequest] = deriveEncoder
  given Decoder[AddCustomerAddressRequest] = deriveDecoder

final case class RemoveCustomerAddressRequest(address: String)
object RemoveCustomerAddressRequest:
  given Encoder[RemoveCustomerAddressRequest] = deriveEncoder
  given Decoder[RemoveCustomerAddressRequest] = deriveDecoder

final case class SetDefaultCustomerAddressRequest(address: String)
object SetDefaultCustomerAddressRequest:
  given Encoder[SetDefaultCustomerAddressRequest] = deriveEncoder
  given Decoder[SetDefaultCustomerAddressRequest] = deriveDecoder

final case class RechargeBalanceRequest(amountCents: Int)
object RechargeBalanceRequest:
  given Encoder[RechargeBalanceRequest] = deriveEncoder
  given Decoder[RechargeBalanceRequest] = deriveDecoder

final case class UpdateMerchantProfileRequest(
    contactPhone: String,
    payoutAccount: MerchantPayoutAccount,
)
object UpdateMerchantProfileRequest:
  given Encoder[UpdateMerchantProfileRequest] = deriveEncoder
  given Decoder[UpdateMerchantProfileRequest] = deriveDecoder

final case class UpdateRiderProfileRequest(
    payoutAccount: MerchantPayoutAccount,
)
object UpdateRiderProfileRequest:
  given Encoder[UpdateRiderProfileRequest] = deriveEncoder
  given Decoder[UpdateRiderProfileRequest] = deriveDecoder

final case class WithdrawMerchantIncomeRequest(amountCents: Int)
object WithdrawMerchantIncomeRequest:
  given Encoder[WithdrawMerchantIncomeRequest] = deriveEncoder
  given Decoder[WithdrawMerchantIncomeRequest] = deriveDecoder

final case class WithdrawRiderIncomeRequest(amountCents: Int)
object WithdrawRiderIncomeRequest:
  given Encoder[WithdrawRiderIncomeRequest] = deriveEncoder
  given Decoder[WithdrawRiderIncomeRequest] = deriveDecoder

final case class AssignRiderRequest(riderId: String)
object AssignRiderRequest:
  given Encoder[AssignRiderRequest] = deriveEncoder
  given Decoder[AssignRiderRequest] = deriveDecoder

final case class RejectOrderRequest(reason: String)
object RejectOrderRequest:
  given Encoder[RejectOrderRequest] = deriveEncoder
  given Decoder[RejectOrderRequest] = deriveDecoder

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

final case class ImageUploadResponse(url: String)
object ImageUploadResponse:
  given Encoder[ImageUploadResponse] = deriveEncoder
  given Decoder[ImageUploadResponse] = deriveDecoder

final case class ReviewMerchantApplicationRequest(reviewNote: String)
object ReviewMerchantApplicationRequest:
  given Encoder[ReviewMerchantApplicationRequest] = deriveEncoder
  given Decoder[ReviewMerchantApplicationRequest] = deriveDecoder

final case class ReviewAppealRequest(appellantRole: AppealRole, reason: String)
object ReviewAppealRequest:
  given Encoder[ReviewAppealRequest] = deriveEncoder
  given Decoder[ReviewAppealRequest] = deriveDecoder

final case class ResolveReviewAppealRequest(approved: Boolean, resolutionNote: String)
object ResolveReviewAppealRequest:
  given Encoder[ResolveReviewAppealRequest] = deriveEncoder
  given Decoder[ResolveReviewAppealRequest] = deriveDecoder

final case class ReviewSubmission(
    rating: Int,
    comment: Option[String],
    extraNote: Option[String],
)
object ReviewSubmission:
  given Encoder[ReviewSubmission] = deriveEncoder
  given Decoder[ReviewSubmission] = deriveDecoder

final case class ReviewOrderRequest(
    storeReview: Option[ReviewSubmission],
    riderReview: Option[ReviewSubmission],
)
object ReviewOrderRequest:
  given Encoder[ReviewOrderRequest] = deriveEncoder
  given Decoder[ReviewOrderRequest] = deriveDecoder

final case class ResolveTicketRequest(resolution: String, note: String)
object ResolveTicketRequest:
  given Encoder[ResolveTicketRequest] = deriveEncoder
  given Decoder[ResolveTicketRequest] = deriveDecoder

final case class SendOrderChatMessageRequest(body: String)
object SendOrderChatMessageRequest:
  given Encoder[SendOrderChatMessageRequest] = deriveEncoder
  given Decoder[SendOrderChatMessageRequest] = deriveDecoder

final case class SubmitPartialRefundRequest(
    menuItemId: String,
    quantity: Int,
    reason: String,
)
object SubmitPartialRefundRequest:
  given Encoder[SubmitPartialRefundRequest] = deriveEncoder
  given Decoder[SubmitPartialRefundRequest] = deriveDecoder

final case class ResolvePartialRefundRequest(
    approved: Boolean,
    resolutionNote: String,
)
object ResolvePartialRefundRequest:
  given Encoder[ResolvePartialRefundRequest] = deriveEncoder
  given Decoder[ResolvePartialRefundRequest] = deriveDecoder

final case class OrderLineItem(
    menuItemId: String,
    name: String,
    quantity: Int,
    unitPriceCents: Int,
    refundedQuantity: Int,
)
object OrderLineItem:
  given Encoder[OrderLineItem] = deriveEncoder
  given Decoder[OrderLineItem] = Decoder.instance { cursor =>
    for
      menuItemId <- cursor.get[String]("menuItemId")
      name <- cursor.get[String]("name")
      quantity <- cursor.get[Int]("quantity")
      unitPriceCents <- cursor.get[Int]("unitPriceCents")
      refundedQuantity <- cursor.getOrElse[Int]("refundedQuantity")(0)
    yield OrderLineItem(
      menuItemId = menuItemId,
      name = name,
      quantity = quantity,
      unitPriceCents = unitPriceCents,
      refundedQuantity = refundedQuantity,
    )
  }

final case class OrderTimelineEntry(status: OrderStatus, note: String, at: String)
object OrderTimelineEntry:
  given Encoder[OrderTimelineEntry] = deriveEncoder
  given Decoder[OrderTimelineEntry] = deriveDecoder

final case class OrderChatMessage(
    id: String,
    senderRole: UserRole,
    senderName: String,
    body: String,
    sentAt: String,
)
object OrderChatMessage:
  given Encoder[OrderChatMessage] = deriveEncoder
  given Decoder[OrderChatMessage] = deriveDecoder

final case class OrderPartialRefundRequest(
    id: String,
    orderId: String,
    menuItemId: String,
    itemName: String,
    quantity: Int,
    reason: String,
    status: PartialRefundStatus,
    resolutionNote: Option[String],
    submittedAt: String,
    reviewedAt: Option[String],
)
object OrderPartialRefundRequest:
  given Encoder[OrderPartialRefundRequest] = deriveEncoder
  given Decoder[OrderPartialRefundRequest] = deriveDecoder

final case class OrderSummary(
    id: String,
    customerId: String,
    customerName: String,
    storeId: String,
    storeName: String,
    riderId: Option[String],
    riderName: Option[String],
    status: OrderStatus,
    deliveryAddress: String,
    scheduledDeliveryAt: String,
    remark: Option[String],
    items: List[OrderLineItem],
    itemSubtotalCents: Int,
    deliveryFeeCents: Int,
    totalPriceCents: Int,
    createdAt: String,
    updatedAt: String,
    storeRating: Option[Int],
    riderRating: Option[Int],
    reviewComment: Option[String],
    reviewExtraNote: Option[String],
    storeReviewComment: Option[String],
    storeReviewExtraNote: Option[String],
    riderReviewComment: Option[String],
    riderReviewExtraNote: Option[String],
    merchantRejectReason: Option[String],
    reviewStatus: ReviewStatus,
    reviewRevokedReason: Option[String],
    reviewRevokedAt: Option[String],
    timeline: List[OrderTimelineEntry],
    chatMessages: List[OrderChatMessage],
    partialRefundRequests: List[OrderPartialRefundRequest],
)
object OrderSummary:
  given Encoder[OrderSummary] = Encoder.instance { order =>
    Json.obj(
      "id" -> Json.fromString(order.id),
      "customerId" -> Json.fromString(order.customerId),
      "customerName" -> Json.fromString(order.customerName),
      "storeId" -> Json.fromString(order.storeId),
      "storeName" -> Json.fromString(order.storeName),
      "riderId" -> Encoder.encodeOption[String].apply(order.riderId),
      "riderName" -> Encoder.encodeOption[String].apply(order.riderName),
      "status" -> summon[Encoder[OrderStatus]].apply(order.status),
      "deliveryAddress" -> Json.fromString(order.deliveryAddress),
      "scheduledDeliveryAt" -> Json.fromString(order.scheduledDeliveryAt),
      "remark" -> Encoder.encodeOption[String].apply(order.remark),
      "items" -> Encoder.encodeList[OrderLineItem].apply(order.items),
      "itemSubtotalCents" -> Json.fromInt(order.itemSubtotalCents),
      "deliveryFeeCents" -> Json.fromInt(order.deliveryFeeCents),
      "totalPriceCents" -> Json.fromInt(order.totalPriceCents),
      "createdAt" -> Json.fromString(order.createdAt),
      "updatedAt" -> Json.fromString(order.updatedAt),
      "storeRating" -> Encoder.encodeOption[Int].apply(order.storeRating),
      "riderRating" -> Encoder.encodeOption[Int].apply(order.riderRating),
      "reviewComment" -> Encoder.encodeOption[String].apply(order.reviewComment),
      "reviewExtraNote" -> Encoder.encodeOption[String].apply(order.reviewExtraNote),
      "storeReviewComment" -> Encoder.encodeOption[String].apply(order.storeReviewComment),
      "storeReviewExtraNote" -> Encoder.encodeOption[String].apply(order.storeReviewExtraNote),
      "riderReviewComment" -> Encoder.encodeOption[String].apply(order.riderReviewComment),
      "riderReviewExtraNote" -> Encoder.encodeOption[String].apply(order.riderReviewExtraNote),
      "merchantRejectReason" -> Encoder.encodeOption[String].apply(order.merchantRejectReason),
      "reviewStatus" -> summon[Encoder[ReviewStatus]].apply(order.reviewStatus),
      "reviewRevokedReason" -> Encoder.encodeOption[String].apply(order.reviewRevokedReason),
      "reviewRevokedAt" -> Encoder.encodeOption[String].apply(order.reviewRevokedAt),
      "timeline" -> Encoder.encodeList[OrderTimelineEntry].apply(order.timeline),
      "chatMessages" -> Encoder.encodeList[OrderChatMessage].apply(order.chatMessages),
      "partialRefundRequests" -> Encoder.encodeList[OrderPartialRefundRequest].apply(order.partialRefundRequests),
    )
  }
  given Decoder[OrderSummary] = Decoder.instance { cursor =>
    for
      id <- cursor.get[String]("id")
      customerId <- cursor.get[String]("customerId")
      customerName <- cursor.get[String]("customerName")
      storeId <- cursor.get[String]("storeId")
      storeName <- cursor.get[String]("storeName")
      riderId <- cursor.get[Option[String]]("riderId")
      riderName <- cursor.get[Option[String]]("riderName")
      status <- cursor.get[OrderStatus]("status")
      deliveryAddress <- cursor.get[String]("deliveryAddress")
      createdAt <- cursor.get[String]("createdAt")
      scheduledDeliveryAt <- cursor.getOrElse[String]("scheduledDeliveryAt")(createdAt)
      remark <- cursor.get[Option[String]]("remark")
      items <- cursor.get[List[OrderLineItem]]("items")
      totalPriceCents <- cursor.get[Int]("totalPriceCents")
      itemSubtotalCents <- cursor.getOrElse[Int]("itemSubtotalCents")(totalPriceCents)
      deliveryFeeCents <- cursor.getOrElse[Int]("deliveryFeeCents")(0)
      updatedAt <- cursor.get[String]("updatedAt")
      storeRating <- cursor.get[Option[Int]]("storeRating")
      riderRating <- cursor.get[Option[Int]]("riderRating")
      reviewComment <- cursor.get[Option[String]]("reviewComment")
      reviewExtraNote <- cursor.get[Option[String]]("reviewExtraNote")
      storeReviewComment <- cursor.get[Option[String]]("storeReviewComment")
      storeReviewExtraNote <- cursor.get[Option[String]]("storeReviewExtraNote")
      riderReviewComment <- cursor.get[Option[String]]("riderReviewComment")
      riderReviewExtraNote <- cursor.get[Option[String]]("riderReviewExtraNote")
      merchantRejectReason <- cursor.get[Option[String]]("merchantRejectReason")
      reviewStatus <- cursor.get[ReviewStatus]("reviewStatus")
      reviewRevokedReason <- cursor.get[Option[String]]("reviewRevokedReason")
      reviewRevokedAt <- cursor.get[Option[String]]("reviewRevokedAt")
      timeline <- cursor.get[List[OrderTimelineEntry]]("timeline")
      chatMessages <- cursor.getOrElse[List[OrderChatMessage]]("chatMessages")(List.empty)
      partialRefundRequests <- cursor.getOrElse[List[OrderPartialRefundRequest]]("partialRefundRequests")(List.empty)
    yield OrderSummary(
      id = id,
      customerId = customerId,
      customerName = customerName,
      storeId = storeId,
      storeName = storeName,
      riderId = riderId,
      riderName = riderName,
      status = status,
      deliveryAddress = deliveryAddress,
      scheduledDeliveryAt = scheduledDeliveryAt,
      remark = remark,
      items = items,
      itemSubtotalCents = itemSubtotalCents,
      deliveryFeeCents = deliveryFeeCents,
      totalPriceCents = totalPriceCents,
      createdAt = createdAt,
      updatedAt = updatedAt,
      storeRating = storeRating,
      riderRating = riderRating,
      reviewComment = reviewComment,
      reviewExtraNote = reviewExtraNote,
      storeReviewComment = storeReviewComment,
      storeReviewExtraNote = storeReviewExtraNote,
      riderReviewComment = riderReviewComment,
      riderReviewExtraNote = riderReviewExtraNote,
      merchantRejectReason = merchantRejectReason,
      reviewStatus = reviewStatus,
      reviewRevokedReason = reviewRevokedReason,
      reviewRevokedAt = reviewRevokedAt,
      timeline = timeline,
      chatMessages = chatMessages,
      partialRefundRequests = partialRefundRequests,
    )
  }

final case class ReviewAppeal(
    id: String,
    orderId: String,
    customerId: String,
    customerName: String,
    storeId: String,
    riderId: Option[String],
    appellantRole: AppealRole,
    reason: String,
    status: AppealStatus,
    resolutionNote: Option[String],
    submittedAt: String,
    reviewedAt: Option[String],
)
object ReviewAppeal:
  given Encoder[ReviewAppeal] = deriveEncoder
  given Decoder[ReviewAppeal] = deriveDecoder

final case class EligibilityReviewRequest(
    target: EligibilityReviewTarget,
    targetId: String,
    reason: String,
)
object EligibilityReviewRequest:
  given Encoder[EligibilityReviewRequest] = deriveEncoder
  given Decoder[EligibilityReviewRequest] = deriveDecoder

final case class ResolveEligibilityReviewRequest(approved: Boolean, resolutionNote: String)
object ResolveEligibilityReviewRequest:
  given Encoder[ResolveEligibilityReviewRequest] = deriveEncoder
  given Decoder[ResolveEligibilityReviewRequest] = deriveDecoder

final case class EligibilityReview(
    id: String,
    target: EligibilityReviewTarget,
    targetId: String,
    targetName: String,
    reason: String,
    status: AppealStatus,
    resolutionNote: Option[String],
    submittedAt: String,
    reviewedAt: Option[String],
)
object EligibilityReview:
  given Encoder[EligibilityReview] = deriveEncoder
  given Decoder[EligibilityReview] = deriveDecoder

final case class AdminTicket(
    id: String,
    orderId: String,
    kind: TicketKind,
    status: TicketStatus,
    summary: String,
    resolutionNote: Option[String],
    updatedAt: String,
)
object AdminTicket:
  given Encoder[AdminTicket] = deriveEncoder
  given Decoder[AdminTicket] = deriveDecoder

final case class SystemMetrics(
    totalOrders: Int,
    activeOrders: Int,
    resolvedTickets: Int,
    averageRating: Double,
)
object SystemMetrics:
  given Encoder[SystemMetrics] = deriveEncoder
  given Decoder[SystemMetrics] = deriveDecoder

final case class DeliveryAppState(
    customers: List[Customer],
    stores: List[Store],
    merchantProfiles: List[MerchantProfile],
    riders: List[Rider],
    admins: List[AdminProfile],
    merchantApplications: List[MerchantApplication],
    reviewAppeals: List[ReviewAppeal],
    eligibilityReviews: List[EligibilityReview],
    orders: List[OrderSummary],
    tickets: List[AdminTicket],
    metrics: SystemMetrics,
)
object DeliveryAppState:
  given Encoder[DeliveryAppState] = deriveEncoder
  given Decoder[DeliveryAppState] = Decoder.instance { cursor =>
    for
      customers <- cursor.getOrElse[List[Customer]]("customers")(List.empty)
      stores <- cursor.getOrElse[List[Store]]("stores")(List.empty)
      merchantProfiles <- cursor.getOrElse[List[MerchantProfile]]("merchantProfiles")(List.empty)
      riders <- cursor.getOrElse[List[Rider]]("riders")(List.empty)
      admins <- cursor.getOrElse[List[AdminProfile]]("admins")(List.empty)
      merchantApplications <- cursor.getOrElse[List[MerchantApplication]]("merchantApplications")(List.empty)
      reviewAppeals <- cursor.getOrElse[List[ReviewAppeal]]("reviewAppeals")(List.empty)
      eligibilityReviews <- cursor.getOrElse[List[EligibilityReview]]("eligibilityReviews")(List.empty)
      orders <- cursor.getOrElse[List[OrderSummary]]("orders")(List.empty)
      tickets <- cursor.getOrElse[List[AdminTicket]]("tickets")(List.empty)
      metrics <- cursor.getOrElse[SystemMetrics]("metrics")(SystemMetrics(0, 0, 0, 0.0))
    yield DeliveryAppState(
      customers = customers,
      stores = stores,
      merchantProfiles = merchantProfiles,
      riders = riders,
      admins = admins,
      merchantApplications = merchantApplications,
      reviewAppeals = reviewAppeals,
      eligibilityReviews = eligibilityReviews,
      orders = orders,
      tickets = tickets,
      metrics = metrics,
    )
  }
