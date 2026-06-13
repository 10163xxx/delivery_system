package system.api.health

import domain.shared.given

import cats.effect.IO
import domain.shared.*
import io.circe.syntax.*
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityEncoder.*
import org.typelevel.log4cats.slf4j.Slf4jLogger
import system.api.*

private val healthRouteLogger = Slf4jLogger.getLogger[IO]

val healthRoute: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req if matchesApi0(healthApi, req) =>
    for
      _ <- healthRouteLogger.info("HealthRoute received GET /api/health")
      response <- Ok(
        HealthResponse(
          status = serviceStatus("ok"),
          service = serviceName("backend-sample"),
        ).asJson
      )
    yield response
}
