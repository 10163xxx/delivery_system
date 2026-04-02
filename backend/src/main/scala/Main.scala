import cats.effect.{IO, IOApp}
import com.comcast.ip4s.{Host, Port, host}
import routes.ApiRouter
import org.http4s.server.middleware.CORS
import org.http4s.ember.server.EmberServerBuilder
import org.http4s.server.Server
import org.http4s.server.middleware.Logger
import org.typelevel.log4cats.slf4j.Slf4jLogger

object Main extends IOApp.Simple:

  private val logger = Slf4jLogger.getLogger[IO]
  private val serverHost = Host.fromString(sys.env.getOrElse("APP_HOST", "0.0.0.0")).getOrElse(host"0.0.0.0")
  private val serverPort = Port.fromInt(sys.env.get("APP_PORT").flatMap(_.toIntOption).getOrElse(8081)).getOrElse(Port.fromInt(8081).get)

  private val httpApp =
    CORS.policy.withAllowOriginAll(
      Logger.httpApp(logHeaders = true, logBody = false)(ApiRouter.httpApp)
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
      _ <- logger.info(s"Starting backend-sample on http://$serverHost:$serverPort")
      _ <- serverResource.useForever
    yield ()
