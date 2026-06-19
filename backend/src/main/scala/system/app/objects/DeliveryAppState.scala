package system.app.objects

// Business note: system-owned application object; mirror it in the frontend only when it is part of protocol or shared app state.
import system.objects.given
import system.objects.*

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import services.admin.objects.{AdminProfile, AdminTicket}
import services.customer.objects.Customer
import services.merchant.objects.{MerchantApplication, MerchantProfile, Store}
import services.order.objects.OrderSummary
import services.review.objects.{EligibilityReview, ReviewAppeal}
import services.rider.objects.Rider

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
      deliveryState = DeliveryOrderState(
        orders = orders,
        tickets = tickets,
        metrics = metrics,
      ),
    )
  }
