import cats.effect.{IO, IOApp}
import com.comcast.ip4s.{Host, Port, host}
import domain.shared.ServerDefaults
import http.backendHttpApp
import org.http4s.server.middleware.CORS
import org.http4s.ember.server.EmberServerBuilder
import org.http4s.server.Server
import org.http4s.server.middleware.Logger
import org.typelevel.log4cats.slf4j.Slf4jLogger

object Main extends IOApp.Simple:

  private val logger = Slf4jLogger.getLogger[IO]
  private val defaultServerHost = Host.fromString(ServerDefaults.Host).getOrElse(host"0.0.0.0")
  private val serverHost =
    Host.fromString(sys.env.getOrElse(ServerDefaults.HostEnv, ServerDefaults.Host)).getOrElse(defaultServerHost)
  private val serverPort =
    Port
      .fromInt(sys.env.get(ServerDefaults.PortEnv).flatMap(_.toIntOption).getOrElse(ServerDefaults.Port))
      .getOrElse(Port.fromInt(ServerDefaults.Port).get)

  private val httpApp =
    CORS.policy.withAllowOriginAll(
      Logger.httpApp(logHeaders = true, logBody = false)(backendHttpApp)
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
