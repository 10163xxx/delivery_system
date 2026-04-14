package api.health

import domain.shared.given

import cats.effect.IO
import domain.shared.{HealthResponse, ServiceName, ServiceStatus}
import io.circe.syntax.*
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityEncoder.*
import org.http4s.dsl.io.*
import org.typelevel.log4cats.slf4j.Slf4jLogger

private val healthRoutesLogger = Slf4jLogger.getLogger[IO]

val healthRoutes: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case GET -> Root / "api" / "health" =>
    for
      _ <- healthRoutesLogger.info("HealthRoutes received GET /api/health")
      response <- Ok(HealthResponse(status = new ServiceStatus("ok"), service = new ServiceName("backend-sample")).asJson)
    yield response
}
