package system.api.health

import system.objects.given

import cats.effect.IO
import system.objects.*
import io.circe.syntax.*
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityEncoder.*
import org.typelevel.log4cats.slf4j.Slf4jLogger
import system.api.*
import system.objects.HealthResponse

private val healthRouteLogger = Slf4jLogger.getLogger[IO]

val healthRoute: HttpRoutes[IO] = apiRoute(healthApi) { _ =>
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
