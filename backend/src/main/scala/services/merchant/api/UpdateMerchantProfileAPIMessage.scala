package services.merchant.api

import domain.shared.given

import cats.effect.IO
import domain.merchant.UpdateMerchantProfileRequest
import domain.shared.{DeliveryAppState, UserRole}
import services.merchant.utils.*
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.dsl.io.*
import system.api.*
import system.app.*

val updateMerchantProfileApi: FixedMethodApi0[DeliveryAppState] =
  jsonPostApi0[UpdateMerchantProfileRequest, DeliveryAppState](
    routeSegment("api"),
    routeSegment("delivery"),
    routeSegment("merchant-profile"),
  )
