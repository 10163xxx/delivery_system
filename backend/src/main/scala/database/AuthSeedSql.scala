package database

import cats.effect.IO
import domain.shared.AuthPersistenceDefaults

import java.nio.charset.StandardCharsets
import java.nio.file.Files
import java.sql.Connection

def seedAuthAccountsFromSql(connection: Connection): IO[Unit] =
  IO.blocking {
    if Files.exists(AuthPersistenceDefaults.SeedScriptPath) then
      val script = Files.readString(AuthPersistenceDefaults.SeedScriptPath, StandardCharsets.UTF_8)
      script
        .split(";")
        .map(_.trim)
        .filter(_.nonEmpty)
        .foreach { sql =>
          val statement = connection.createStatement()
          try
            statement.execute(sql)
            ()
          finally statement.close()
        }
    else ()
  }
