package admin.api

import domain.shared.given

import cats.effect.IO
import domain.merchant.ReviewMerchantApplicationRequest
import domain.shared.{DeliveryAppState, MerchantApplicationId, UserRole}
import merchant.app.*
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import shared.api.routing.*

val rejectMerchantApplicationApi: FixedMethodApi1[MerchantApplicationId, DeliveryAppState] =
  jsonPostApi1[MerchantApplicationId, ReviewMerchantApplicationRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("merchant-applications")),
    List(routeSegment("reject")),
  )
