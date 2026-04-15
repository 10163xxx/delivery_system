package domain.shared

import domain.shared.given

import io.circe.{Decoder, Encoder}

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

enum AfterSalesRequestType:
  case ReturnRequest, CompensationRequest

object AfterSalesRequestType:
  given Encoder[AfterSalesRequestType] = Encoder.encodeString.contramap(_.toString)
  given Decoder[AfterSalesRequestType] = Decoder.decodeString.emap { value =>
    AfterSalesRequestType.values.find(_.toString == value).toRight(s"Invalid AfterSalesRequestType: $value")
  }

enum AfterSalesResolutionMode:
  case Balance, Coupon, Manual

object AfterSalesResolutionMode:
  given Encoder[AfterSalesResolutionMode] = Encoder.encodeString.contramap(_.toString)
  given Decoder[AfterSalesResolutionMode] = Decoder.decodeString.emap { value =>
    AfterSalesResolutionMode.values.find(_.toString == value).toRight(s"Invalid AfterSalesResolutionMode: $value")
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
