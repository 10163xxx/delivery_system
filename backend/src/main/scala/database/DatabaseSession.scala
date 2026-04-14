package database

import domain.shared.given

import cats.effect.{IO, Resource}
import domain.shared.DatabaseRuntimeDefaults
import com.zaxxer.hikari.{HikariConfig, HikariDataSource}
import org.typelevel.log4cats.slf4j.Slf4jLogger

import java.sql.Connection
import java.util.concurrent.atomic.AtomicReference

private val databaseSessionLogger = Slf4jLogger.getLogger[IO]
private val databaseSessionConfig = defaultDatabaseConfig
private val databaseDataSourceRef = AtomicReference[Option[HikariDataSource]](None)

def initializeDatabaseSession: Resource[IO, Unit] =
  for
    dataSource <- Resource.make(createDatabaseDataSource)(closeDatabaseDataSource)
    _ <- Resource.make(registerDatabaseDataSource(dataSource))(_ => clearDatabaseDataSourceRegistration)
  yield ()

private def createDatabaseDataSource: IO[HikariDataSource] =
  IO.blocking {
    Class.forName(DatabaseRuntimeDefaults.DriverClassName.raw)
    val hikariConfig = HikariConfig()
    hikariConfig.setJdbcUrl(databaseConfigUrl(databaseSessionConfig).raw)
    hikariConfig.setUsername(databaseSessionConfig.user.raw)
    hikariConfig.setPassword(databaseSessionConfig.password.raw)
    hikariConfig.setMaximumPoolSize(databaseSessionConfig.maxPoolSize)
    hikariConfig.setConnectionTimeout(databaseSessionConfig.connectionTimeoutMs)
    hikariConfig.setPoolName(DatabaseRuntimeDefaults.PoolName.raw)
    new HikariDataSource(hikariConfig)
  }.flatTap(_ =>
    databaseSessionLogger.info(
      s"Initialized PostgreSQL connection pool, host=${databaseSessionConfig.host}, port=${databaseSessionConfig.port}, database=${databaseSessionConfig.databaseName}, maxPoolSize=${databaseSessionConfig.maxPoolSize}"
    )
  )

private def closeDatabaseDataSource(dataSource: HikariDataSource): IO[Unit] =
  IO.blocking(dataSource.close()).handleErrorWith(_ => IO.unit)

private def registerDatabaseDataSource(dataSource: HikariDataSource): IO[Unit] =
  IO {
    databaseDataSourceRef.set(Some(dataSource))
  }

private def clearDatabaseDataSourceRegistration: IO[Unit] =
  IO {
    databaseDataSourceRef.set(None)
  }

private def databaseDataSourceOrFail: IO[HikariDataSource] =
  IO.fromOption(databaseDataSourceRef.get())(
    new IllegalStateException(DatabaseRuntimeDefaults.NotInitializedMessage.raw)
  )

private def pooledConnectionResource: Resource[IO, Connection] =
  Resource.make {
    databaseDataSourceOrFail.flatMap(dataSource =>
      IO.blocking(dataSource.getConnection)
    )
  } { connection =>
    IO.blocking(connection.close()).handleErrorWith(_ => IO.unit)
  }

def withTransactionConnection[A](operation: Connection => IO[A]): IO[A] =
  pooledConnectionResource.use { connection =>
    for
      _ <- IO.blocking(connection.setAutoCommit(false))
      result <- operation(connection).attempt
      _ <- result match
        case Right(_) => IO.blocking(connection.commit())
        case Left(_) => IO.blocking(connection.rollback()).handleErrorWith(_ => IO.unit)
      value <- IO.fromEither(result)
    yield value
  }
