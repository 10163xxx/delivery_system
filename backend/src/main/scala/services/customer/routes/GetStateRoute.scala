package services.customer.routes

import services.customer.api.*

import domain.shared.given

import cats.effect.IO
import domain.shared.DeliveryAppState
import io.circe.syntax.*
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityEncoder.*
import system.api.*
import system.app.getStateForUser

val getStateRoute: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req if matchesApi0(getStateApi, req) =>
    val matchedReq = requireApi0(getStateApi, req)
    withSession(matchedReq) { user =>
      getStateForUser(user).flatMap(state => Ok(state.asJson))
    }
}
