package system

import system.objects.given
import services.auth.objects.*

import cats.effect.IO
import system.objects.*

final case class DatabaseConfig(
  host: HostName,
  port: PortNumber,
  databaseName: DatabaseName,
  user: Username,
  password: Password,
  maxPoolSize: PoolSize,
  connectionTimeoutMs: TimeoutMilliseconds
)

private def defaultDatabaseName: DatabaseName =
  sys.env
    .get(DatabaseRuntimeDefaults.NameEnv.raw)
    .map(databaseName)
    .getOrElse(DatabaseRuntimeDefaults.DefaultDatabaseName)

private def invalidEnvValue(envName: EnvVarName, rawValue: String): IllegalArgumentException =
  IllegalArgumentException(s"Invalid ${envName.raw}: $rawValue")

private def parseOptionalIntEnv[T](envName: EnvVarName, defaultValue: T)(build: Int => T): IO[T] =
  sys.env.get(envName.raw) match
    case Some(rawValue) =>
      IO.fromOption(rawValue.toIntOption.map(build))(
        invalidEnvValue(envName, rawValue)
      )
    case None => IO.pure(defaultValue)

private def parseOptionalLongEnv[T](envName: EnvVarName, defaultValue: T)(build: Long => T): IO[T] =
  sys.env.get(envName.raw) match
    case Some(rawValue) =>
      IO.fromOption(rawValue.toLongOption.map(build))(
        invalidEnvValue(envName, rawValue)
      )
    case None => IO.pure(defaultValue)

def databaseConfigUrl(config: DatabaseConfig): UrlText =
  urlText(s"jdbc:postgresql://${config.host.raw}:${config.port}/${config.databaseName.raw}")

def loadDefaultDatabaseConfig: IO[DatabaseConfig] =
  for
    port <- parseOptionalIntEnv(DatabaseRuntimeDefaults.PortEnv, DatabaseRuntimeDefaults.DefaultPort)(new PortNumber(_))
    maxPoolSize <- parseOptionalIntEnv(DatabaseRuntimeDefaults.MaxPoolSizeEnv, DatabaseRuntimeDefaults.DefaultMaxPoolSize)(new PoolSize(_))
    connectionTimeoutMs <- parseOptionalLongEnv(DatabaseRuntimeDefaults.ConnectionTimeoutEnv, DatabaseRuntimeDefaults.DefaultConnectionTimeoutMs)(new TimeoutMilliseconds(_))
  yield DatabaseConfig(
    host = hostName(sys.env.getOrElse(DatabaseRuntimeDefaults.HostEnv.raw, DatabaseRuntimeDefaults.DefaultHost.raw)),
    port = port,
    databaseName = defaultDatabaseName,
    user = username(sys.env.getOrElse(DatabaseRuntimeDefaults.UserEnv.raw, DatabaseRuntimeDefaults.DefaultUser.raw)),
    password = password(sys.env.getOrElse(DatabaseRuntimeDefaults.PasswordEnv.raw, DatabaseRuntimeDefaults.DefaultPassword.raw)),
    maxPoolSize = maxPoolSize,
    connectionTimeoutMs = connectionTimeoutMs
  )
