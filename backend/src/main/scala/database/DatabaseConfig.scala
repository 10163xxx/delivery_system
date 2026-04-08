package database

import domain.shared.DatabaseRuntimeDefaults

import java.nio.file.Paths

final case class DatabaseConfig(
  host: String,
  port: Int,
  databaseName: String,
  user: String,
  password: String,
  maxPoolSize: Int,
  connectionTimeoutMs: Long
)

object DatabaseConfig:

  private def defaultDatabaseName: String =
    sys.env
      .get(DatabaseRuntimeDefaults.NameEnv)
      .orElse {
        Option(Paths.get(sys.props.getOrElse("user.dir", ".")).getFileName)
          .map(_.toString.replace('-', '_'))
      }
      .getOrElse(DatabaseRuntimeDefaults.DefaultDatabaseName)

  extension (config: DatabaseConfig)
    def url: String =
      s"jdbc:postgresql://${config.host}:${config.port}/${config.databaseName}"

  val default: DatabaseConfig =
    DatabaseConfig(
      host = sys.env.getOrElse(DatabaseRuntimeDefaults.HostEnv, DatabaseRuntimeDefaults.DefaultHost),
      port = sys.env.get(DatabaseRuntimeDefaults.PortEnv).flatMap(_.toIntOption).getOrElse(DatabaseRuntimeDefaults.DefaultPort),
      databaseName = defaultDatabaseName,
      user = sys.env.getOrElse(DatabaseRuntimeDefaults.UserEnv, DatabaseRuntimeDefaults.DefaultUser),
      password = sys.env.getOrElse(DatabaseRuntimeDefaults.PasswordEnv, DatabaseRuntimeDefaults.DefaultPassword),
      maxPoolSize = sys.env
        .get(DatabaseRuntimeDefaults.MaxPoolSizeEnv)
        .flatMap(_.toIntOption)
        .getOrElse(DatabaseRuntimeDefaults.DefaultMaxPoolSize),
      connectionTimeoutMs = sys.env
        .get(DatabaseRuntimeDefaults.ConnectionTimeoutEnv)
        .flatMap(_.toLongOption)
        .getOrElse(DatabaseRuntimeDefaults.DefaultConnectionTimeoutMs)
    )
