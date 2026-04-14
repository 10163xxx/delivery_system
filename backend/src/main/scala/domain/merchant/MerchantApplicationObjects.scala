package domain.merchant

import domain.shared.given

import domain.shared.*
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*

final case class MerchantApplication(
    id: MerchantApplicationId,
    merchantName: PersonName,
    storeName: DisplayText,
    category: DisplayText,
    businessHours: BusinessHours,
    avgPrepMinutes: Minutes,
    imageUrl: Option[ImageUrl],
    note: Option[NoteText],
    status: MerchantApplicationStatus,
    reviewNote: Option[ResolutionText],
    submittedAt: IsoDateTime,
    reviewedAt: Option[IsoDateTime],
)
object MerchantApplication:
  given Encoder[MerchantApplication] = deriveEncoder
  given Decoder[MerchantApplication] = Decoder.instance { cursor =>
    for
      id <- cursor.get[MerchantApplicationId]("id")
      merchantName <- cursor.get[PersonName]("merchantName")
      storeName <- cursor.get[DisplayText]("storeName")
      category <- cursor.get[DisplayText]("category")
      businessHours <- cursor.getOrElse[BusinessHours]("businessHours")(BusinessHours.Default)
      avgPrepMinutes <- cursor.get[Minutes]("avgPrepMinutes")
      imageUrl <- cursor.get[Option[ImageUrl]]("imageUrl")
      note <- cursor.get[Option[NoteText]]("note")
      status <- cursor.get[MerchantApplicationStatus]("status")
      reviewNote <- cursor.get[Option[ResolutionText]]("reviewNote")
      submittedAt <- cursor.get[IsoDateTime]("submittedAt")
      reviewedAt <- cursor.get[Option[IsoDateTime]]("reviewedAt")
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

final case class MerchantRegistrationRequest(
    merchantName: PersonName,
    storeName: DisplayText,
    category: DisplayText,
    businessHours: BusinessHours,
    avgPrepMinutes: Minutes,
    imageUrl: Option[ImageUrl],
    note: Option[NoteText],
)
object MerchantRegistrationRequest:
  given Encoder[MerchantRegistrationRequest] = deriveEncoder
  given Decoder[MerchantRegistrationRequest] = deriveDecoder

final case class ReviewMerchantApplicationRequest(reviewNote: ResolutionText)
object ReviewMerchantApplicationRequest:
  given Encoder[ReviewMerchantApplicationRequest] = deriveEncoder
  given Decoder[ReviewMerchantApplicationRequest] = deriveDecoder
