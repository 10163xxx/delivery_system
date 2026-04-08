package domain.shared

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import domain.admin.{AdminProfile, AdminTicket}
import domain.customer.Customer
import domain.merchant.{MerchantApplication, MerchantProfile, Store}
import domain.order.OrderSummary
import domain.review.{EligibilityReview, ReviewAppeal}
import domain.rider.Rider

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
