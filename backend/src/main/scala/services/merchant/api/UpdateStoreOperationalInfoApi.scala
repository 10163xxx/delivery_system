package services.merchant.api

import domain.shared.given

import cats.effect.IO
import domain.merchant.UpdateStoreOperationalRequest
import domain.shared.{DeliveryAppState, StoreId, UserRole}
import services.merchant.utils.*
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.dsl.io.*
import system.api.*
import system.app.*

val updateStoreOperationalInfoApi: FixedMethodApi1[StoreId, DeliveryAppState] =
  jsonPostApi1[StoreId, UpdateStoreOperationalRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("stores")),
    List(routeSegment("operations")),
  )
