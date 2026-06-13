package services.merchant.api

import domain.shared.given

import cats.effect.IO
import domain.shared.{DeliveryAppState, MenuItemId, StoreId, UserRole}
import services.merchant.utils.*
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityEncoder.*
import org.http4s.dsl.io.*
import system.api.*
import system.app.*

val removeMenuItemApi: FixedMethodApi2[StoreId, MenuItemId, DeliveryAppState] =
  jsonPostApi2[StoreId, MenuItemId, Unit, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("stores")),
    List(routeSegment("menu")),
    List(routeSegment("remove")),
  )
