package merchant.api

import domain.shared.given

import cats.effect.IO
import domain.merchant.WithdrawMerchantIncomeRequest
import domain.shared.{DeliveryAppState, UserRole}
import merchant.app.*
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.dsl.io.*
import shared.api.routing.*
import shared.app.*

val withdrawMerchantIncomeApi: FixedMethodApi0[DeliveryAppState] =
  jsonPostApi0[WithdrawMerchantIncomeRequest, DeliveryAppState](
    routeSegment("api"),
    routeSegment("delivery"),
    routeSegment("merchant-profile"),
    routeSegment("withdraw"),
  )
