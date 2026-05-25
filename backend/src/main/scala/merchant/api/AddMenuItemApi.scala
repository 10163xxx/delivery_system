package merchant.api

import domain.shared.given

import cats.effect.IO
import domain.merchant.AddMenuItemRequest
import domain.shared.{DeliveryAppState, StoreId, UserRole}
import merchant.app.*
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.dsl.io.*
import shared.api.routing.*
import shared.app.*

val addMenuItemApi: FixedMethodApi1[StoreId, DeliveryAppState] =
  jsonPostApi1[StoreId, AddMenuItemRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("stores")),
    List(routeSegment("menu")),
  )
