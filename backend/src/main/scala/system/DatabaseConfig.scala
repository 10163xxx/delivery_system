package system

import domain.shared.given

import domain.shared.*

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

def databaseConfigUrl(config: DatabaseConfig): UrlText =
  urlText(s"jdbc:postgresql://${config.host.raw}:${config.port}/${config.databaseName.raw}")

val defaultDatabaseConfig: DatabaseConfig =
  DatabaseConfig(
    host = hostName(sys.env.getOrElse(DatabaseRuntimeDefaults.HostEnv.raw, DatabaseRuntimeDefaults.DefaultHost.raw)),
    port = sys.env.get(DatabaseRuntimeDefaults.PortEnv.raw).flatMap(_.toIntOption).map(value => new PortNumber(value)).getOrElse(DatabaseRuntimeDefaults.DefaultPort),
    databaseName = defaultDatabaseName,
    user = username(sys.env.getOrElse(DatabaseRuntimeDefaults.UserEnv.raw, DatabaseRuntimeDefaults.DefaultUser.raw)),
    password = password(sys.env.getOrElse(DatabaseRuntimeDefaults.PasswordEnv.raw, DatabaseRuntimeDefaults.DefaultPassword.raw)),
    maxPoolSize = sys.env
      .get(DatabaseRuntimeDefaults.MaxPoolSizeEnv.raw)
      .flatMap(_.toIntOption)
      .map(value => new PoolSize(value))
      .getOrElse(DatabaseRuntimeDefaults.DefaultMaxPoolSize),
    connectionTimeoutMs = sys.env
      .get(DatabaseRuntimeDefaults.ConnectionTimeoutEnv.raw)
      .flatMap(_.toLongOption)
      .map(value => new TimeoutMilliseconds(value))
      .getOrElse(DatabaseRuntimeDefaults.DefaultConnectionTimeoutMs)
  )
