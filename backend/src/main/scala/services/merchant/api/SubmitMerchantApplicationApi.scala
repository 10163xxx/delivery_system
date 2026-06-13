package services.merchant.api

import domain.shared.given

import cats.effect.IO
import domain.merchant.MerchantRegistrationRequest
import domain.shared.{DeliveryAppState, UserRole}
import services.merchant.utils.*
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import system.api.*

val submitMerchantApplicationApi: FixedMethodApi0[DeliveryAppState] =
  jsonPostApi0[MerchantRegistrationRequest, DeliveryAppState](
    routeSegment("api"),
    routeSegment("delivery"),
    routeSegment("merchant-applications"),
  )
