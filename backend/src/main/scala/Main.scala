import system.objects.given

// Backend process entrypoint: initialize persistence, wrap the API app, and bind the HTTP server.
import cats.effect.{IO, IOApp}
import com.comcast.ip4s.{Host, Port}
import system.objects.ServerDefaults
import org.http4s.server.middleware.CORS
import org.http4s.ember.server.EmberServerBuilder
import org.http4s.server.Server
import org.http4s.server.middleware.Logger
import routes.apiRouter
import services.auth.utils.initializeAuthPersistence
import system.initializeDatabaseSession
import system.app.initializeDeliveryStatePersistence
import system.uploads.initializeStoreImageStorage
import org.typelevel.log4cats.slf4j.Slf4jLogger

object Main extends IOApp.Simple:

  private val logger = Slf4jLogger.getLogger[IO]

  private final case class ServerBindConfig(host: Host, port: Port)

  private def configError(message: String): IllegalStateException =
    IllegalStateException(message)

  private def resolveServerHost: IO[Host] =
    val configuredHost = sys.env.getOrElse(ServerDefaults.HostEnv.raw, ServerDefaults.Host.raw)
    IO.fromOption(Host.fromString(configuredHost))(
      configError(s"Invalid server host: $configuredHost")
    )

  private def resolveServerPort: IO[Port] =
    val configuredPort = sys.env.get(ServerDefaults.PortEnv.raw)
    val parsedPort = configuredPort match
      case Some(rawPort) =>
        IO.fromOption(rawPort.toIntOption)(
          configError(s"Invalid server port: $rawPort")
        )
      case None => IO.pure(ServerDefaults.Port.value)
    parsedPort.flatMap(port =>
      IO.fromOption(Port.fromInt(port))(
        configError(s"Invalid server port: $port")
      )
    )

  private val serverBindConfig: IO[ServerBindConfig] =
    for
      host <- resolveServerHost
      port <- resolveServerPort
    yield ServerBindConfig(host, port)

  private val httpApp =
    CORS.policy.withAllowOriginAll(
      Logger.httpApp(logHeaders = true, logBody = false)(apiRouter)
    )

  private def serverResource(config: ServerBindConfig): cats.effect.Resource[IO, Server] =
    for
      _ <- initializeDatabaseSession
      _ <- cats.effect.Resource.eval(initializeStoreImageStorage)
      _ <- cats.effect.Resource.eval(initializeDeliveryStatePersistence)
      _ <- cats.effect.Resource.eval(initializeAuthPersistence)
      server <- EmberServerBuilder
        .default[IO]
        .withHost(config.host)
        .withPort(config.port)
        .withHttpApp(httpApp)
        .build
    yield server

  override def run: IO[Unit] =
    for
      config <- serverBindConfig
      _ <- logger.info(s"Starting ${ServerDefaults.ServiceName} on http://${config.host}:${config.port}")
      _ <- serverResource(config).useForever
    yield ()
