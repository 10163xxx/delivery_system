package domain.shared

import domain.shared.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import domain.admin.{AdminProfile, AdminTicket}
import domain.customer.Customer
import domain.merchant.{MerchantApplication, MerchantProfile, Store}
import domain.order.OrderSummary
import domain.review.{EligibilityReview, ReviewAppeal}
import domain.rider.Rider

final case class DeliveryOrderState(
    orders: List[OrderSummary],
    tickets: List[AdminTicket],
    metrics: SystemMetrics,
)

final case class DeliveryAppState(
    customers: List[Customer],
    stores: List[Store],
    merchantProfiles: List[MerchantProfile],
    riders: List[Rider],
    admins: List[AdminProfile],
    merchantApplications: List[MerchantApplication],
    reviewAppeals: List[ReviewAppeal],
    eligibilityReviews: List[EligibilityReview],
    deliveryState: DeliveryOrderState,
)
object DeliveryAppState:
  given Encoder[DeliveryOrderState] = deriveEncoder
  given Decoder[DeliveryOrderState] = deriveDecoder

  def apply(
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
  ): DeliveryAppState =
    new DeliveryAppState(
      customers = customers,
      stores = stores,
      merchantProfiles = merchantProfiles,
      riders = riders,
      admins = admins,
      merchantApplications = merchantApplications,
      reviewAppeals = reviewAppeals,
      eligibilityReviews = eligibilityReviews,
      deliveryState = DeliveryOrderState(
        orders = orders,
        tickets = tickets,
        metrics = metrics,
      ),
    )

  extension (state: DeliveryAppState)
    def orders: List[OrderSummary] = state.deliveryState.orders
    def tickets: List[AdminTicket] = state.deliveryState.tickets
    def metrics: SystemMetrics = state.deliveryState.metrics

  given Encoder[DeliveryAppState] = Encoder.instance(state =>
    deriveEncoder[DeliveryAppState]
      .apply(state)
      .deepMerge(deriveEncoder[DeliveryOrderState].apply(state.deliveryState))
      .mapObject(_.remove("deliveryState"))
  )
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
      metrics <- cursor.getOrElse[SystemMetrics]("metrics")(
        SystemMetrics(
          NumericDefaults.ZeroCount,
          NumericDefaults.ZeroCount,
          NumericDefaults.ZeroCount,
          NumericDefaults.ZeroAverageRating,
        )
      )
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
