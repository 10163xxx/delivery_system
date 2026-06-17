package services.merchant.utils

import domain.shared.given

import cats.effect.IO
import domain.merchant.*
import domain.shared.*
import system.app.*

private def findMerchantApplication(
      current: DeliveryAppState,
      applicationId: MerchantApplicationId,
  ): Either[ErrorMessage, MerchantApplication] =
    current.merchantApplications.find(_.id == applicationId).toRight(ValidationMessages.Merchant.MerchantApplicationNotFound)

private def requirePendingApplication(
      application: MerchantApplication,
      pendingError: ErrorMessage,
  ): Either[ErrorMessage, Unit] =
    Either.cond(application.status == MerchantApplicationStatus.Pending, (), pendingError)

private def sanitizeReviewNote(request: ReviewMerchantApplicationRequest): Either[ErrorMessage, ResolutionText] =
    sanitizeRequiredText(
      request.reviewNote,
      DeliveryValidationDefaults.ReviewApplicationNoteMaxLength,
      ValidationMessages.Merchant.ReviewNoteRequired,
    )

private def buildMerchantApplication(
      request: MerchantRegistrationRequest,
      timestamp: IsoDateTime,
  ): MerchantApplication =
    MerchantApplication(
      id = nextId(new DisplayText("app")),
      merchantName = request.merchantName,
      storeName = request.storeName,
      category = request.category,
      storeAddress = request.storeAddress,
      location = request.location,
      businessHours = request.businessHours,
      avgPrepMinutes = request.avgPrepMinutes,
      imageUrl = request.imageUrl,
      note = request.note,
      review = MerchantApplicationReview(
        status = MerchantApplicationStatus.Pending,
        reviewNote = None,
        submittedAt = timestamp,
        reviewedAt = None,
      ),
    )

private def reviewMerchantApplication(
      application: MerchantApplication,
      status: MerchantApplicationStatus,
      reviewNote: ResolutionText,
      timestamp: IsoDateTime,
): MerchantApplication =
    application.copy(
      review = application.review.copy(
        status = status,
        reviewNote = Some(reviewNote),
        reviewedAt = Some(timestamp),
      ),
    )

def submitMerchantApplication(
      request: MerchantRegistrationRequest
  ): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        validateMerchantRegistration(request).map { sanitized =>
          val timestamp = now()
          val application = buildMerchantApplication(sanitized, timestamp)
          withDerivedData(
            current.copy(merchantApplications = application :: current.merchantApplications)
          )
        }
      }
    }

def approveMerchantApplication(
      applicationId: MerchantApplicationId,
      request: ReviewMerchantApplicationRequest,
  ): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          application <- findMerchantApplication(current, applicationId)
          _ <- requirePendingApplication(application, ValidationMessages.Merchant.OnlyPendingApplicationCanApprove)
          reviewNote <- sanitizeReviewNote(request)
        yield
          val timestamp = now()
          val reviewedApplication =
            reviewMerchantApplication(application, MerchantApplicationStatus.Approved, reviewNote, timestamp)
          withDerivedData(
            current.copy(
              stores = createApprovedStore(application) :: current.stores,
              merchantApplications = replaceApplication(current.merchantApplications, reviewedApplication),
            )
          )
      }
    }

def rejectMerchantApplication(
      applicationId: MerchantApplicationId,
      request: ReviewMerchantApplicationRequest,
  ): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          application <- findMerchantApplication(current, applicationId)
          _ <- requirePendingApplication(application, ValidationMessages.Merchant.OnlyPendingApplicationCanReject)
          reviewNote <- sanitizeReviewNote(request)
        yield
          val timestamp = now()
          val reviewedApplication =
            reviewMerchantApplication(application, MerchantApplicationStatus.Rejected, reviewNote, timestamp)
          withDerivedData(
            current.copy(
              merchantApplications = replaceApplication(current.merchantApplications, reviewedApplication)
            )
          )
      }
    }
