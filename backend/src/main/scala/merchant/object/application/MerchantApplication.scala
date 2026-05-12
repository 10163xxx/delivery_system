package domain.merchant

import domain.shared.given

import domain.shared.*
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*

final case class MerchantApplicationReview(
    status: MerchantApplicationStatus,
    reviewNote: Option[ResolutionText],
    submittedAt: IsoDateTime,
    reviewedAt: Option[IsoDateTime],
)

final case class MerchantApplication(
    id: MerchantApplicationId,
    merchantName: PersonName,
    storeName: DisplayText,
    category: DisplayText,
    businessHours: BusinessHours,
    avgPrepMinutes: Minutes,
    imageUrl: Option[ImageUrl],
    note: Option[NoteText],
    review: MerchantApplicationReview,
)
object MerchantApplication:
  given Encoder[MerchantApplicationReview] = deriveEncoder
  given Decoder[MerchantApplicationReview] = deriveDecoder

  def apply(
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
  ): MerchantApplication =
    new MerchantApplication(
      id = id,
      merchantName = merchantName,
      storeName = storeName,
      category = category,
      businessHours = businessHours,
      avgPrepMinutes = avgPrepMinutes,
      imageUrl = imageUrl,
      note = note,
      review = MerchantApplicationReview(
        status = status,
        reviewNote = reviewNote,
        submittedAt = submittedAt,
        reviewedAt = reviewedAt,
      ),
    )

  extension (application: MerchantApplication)
    def status: MerchantApplicationStatus = application.review.status
    def reviewNote: Option[ResolutionText] = application.review.reviewNote
    def submittedAt: IsoDateTime = application.review.submittedAt
    def reviewedAt: Option[IsoDateTime] = application.review.reviewedAt

  given Encoder[MerchantApplication] = Encoder.instance(application =>
    deriveEncoder[MerchantApplication]
      .apply(application)
      .deepMerge(deriveEncoder[MerchantApplicationReview].apply(application.review))
      .mapObject(_.remove("review"))
  )
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
