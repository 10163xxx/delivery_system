package merchant.api

import domain.shared.given

import cats.effect.IO
import domain.merchant.MerchantRegistrationRequest
import domain.shared.{DeliveryAppState, UserRole}
import merchant.app.*
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import shared.api.routing.*

val submitMerchantApplicationApi: FixedMethodApi0[DeliveryAppState] =
  jsonPostApi0[MerchantRegistrationRequest, DeliveryAppState](
    routeSegment("api"),
    routeSegment("delivery"),
    routeSegment("merchant-applications"),
  )
