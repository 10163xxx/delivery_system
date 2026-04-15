package shared.app

import domain.shared.given
import cats.effect.{IO, IOApp}
import com.comcast.ip4s.{Host, Port}
import domain.shared.ServerDefaults
import org.http4s.server.middleware.CORS
import org.http4s.ember.server.EmberServerBuilder
import org.http4s.server.Server
import org.http4s.server.middleware.Logger
import shared.api.backendApiApp
import org.typelevel.log4cats.slf4j.Slf4jLogger

object BackendMain extends IOApp.Simple:

  private val logger = Slf4jLogger.getLogger[IO]
  private val defaultServerHost =
    Host
      .fromString(ServerDefaults.Host.raw)
      .getOrElse(throw new IllegalStateException(s"Invalid default host: ${ServerDefaults.Host.raw}"))
  private val serverHost =
    Host.fromString(sys.env.getOrElse(ServerDefaults.HostEnv.raw, ServerDefaults.Host.raw)).getOrElse(defaultServerHost)
  private val serverPort =
    Port
      .fromInt(sys.env.get(ServerDefaults.PortEnv.raw).flatMap(_.toIntOption).getOrElse(ServerDefaults.Port))
      .getOrElse(Port.fromInt(ServerDefaults.Port).get)

  private val httpApp =
    CORS.policy.withAllowOriginAll(
      Logger.httpApp(logHeaders = true, logBody = false)(backendApiApp)
    )

  private val serverResource: cats.effect.Resource[IO, Server] =
    for
      server <- EmberServerBuilder
        .default[IO]
        .withHost(serverHost)
        .withPort(serverPort)
        .withHttpApp(httpApp)
        .build
    yield server

  override def run: IO[Unit] =
    for
      _ <- logger.info(s"Starting ${ServerDefaults.ServiceName} on http://$serverHost:$serverPort")
      _ <- serverResource.useForever
    yield ()
