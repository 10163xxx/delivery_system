package services.customer.routes

// Business note: route adapter for a typed API message; delegate business decisions to service actions instead of embedding them here.
import services.customer.api.*

import system.objects.given

import cats.effect.IO
import system.app.objects.DeliveryAppState
import io.circe.syntax.*
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityEncoder.*
import system.api.*
import system.app.getStateForUser

val getStateRoute: HttpRoutes[IO] = apiRoute(getStateApi) { matchedReq =>
  withSession(matchedReq) { user =>
    getStateForUser(user).flatMap(state => Ok(state.asJson))
  }
}
