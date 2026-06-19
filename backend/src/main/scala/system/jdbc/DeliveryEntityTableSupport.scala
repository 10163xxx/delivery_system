package system.jdbc

import system.objects.given

import cats.effect.IO
import system.objects.*
import io.circe.{Decoder, Encoder, Printer}
import io.circe.parser.decode
import io.circe.syntax.*

import java.sql.{Connection, ResultSet, Timestamp}

final case class DeliveryEntityTable[A](
    tableName: TableName,
    entityIdOf: A => String,
)

val deliveryStateJsonPrinter = Printer.noSpacesSortKeys
val primaryStateKey = DeliveryPersistenceDefaults.PrimaryStateKey

def initializeEntityTable[A](
    connection: Connection,
    table: DeliveryEntityTable[A],
): IO[Unit] =
  executeSqlStatement(connection, createEntityTableSql(table))

def loadEntityRows[A: Decoder](
    connection: Connection,
    table: DeliveryEntityTable[A],
): IO[List[A]] =
  IO.blocking {
    val statement = connection.prepareStatement(loadEntityRowsSql(table).raw)
    try
      val resultSet = statement.executeQuery()
      try
        sequenceDecodedRows(
          Iterator
          .continually(resultSet.next())
          .takeWhile(identity)
          .map(_ => decodeJsonRow[A](readJsonPayload(resultSet, 1), table.tableName))
          .toList
        )
      finally resultSet.close()
    finally statement.close()
  }.flatMap(IO.fromEither)

def replaceEntityRows[A: Encoder](
    connection: Connection,
    table: DeliveryEntityTable[A],
    values: List[A],
    updatedAt: Timestamp,
): Unit =
  executeBlockingSqlStatement(connection, deleteEntityRowsSql(table))

  val insertStatement = connection.prepareStatement(insertEntityRowSql(table).raw)
  try
    values.zipWithIndex.foreach { case (value, index) =>
      insertStatement.setString(1, table.entityIdOf(value))
      insertStatement.setInt(2, index)
      insertStatement.setString(3, renderJsonPayload(value).raw)
      insertStatement.setTimestamp(4, updatedAt)
      insertStatement.addBatch()
    }
    insertStatement.executeBatch()
    ()
  finally insertStatement.close()

private def createEntityTableSql[A](table: DeliveryEntityTable[A]): SqlStatement =
  new SqlStatement(s"""
      |create table if not exists ${table.tableName.raw} (
      |  ${DeliveryPersistenceDefaults.EntityIdColumnName.raw} varchar(${DeliveryPersistenceDefaults.EntityIdColumnLength}) primary key,
      |  ${DeliveryPersistenceDefaults.PositionColumnName.raw} integer not null,
      |  ${DeliveryPersistenceDefaults.PayloadColumnName.raw} jsonb not null,
      |  ${DeliveryPersistenceDefaults.UpdatedAtColumnName.raw} timestamptz not null
      |);
      |""".stripMargin)

private def insertEntityRowSql[A](table: DeliveryEntityTable[A]): SqlStatement =
  new SqlStatement(s"""
      |insert into ${table.tableName.raw} (
      |  ${DeliveryPersistenceDefaults.EntityIdColumnName.raw},
      |  ${DeliveryPersistenceDefaults.PositionColumnName.raw},
      |  ${DeliveryPersistenceDefaults.PayloadColumnName.raw},
      |  ${DeliveryPersistenceDefaults.UpdatedAtColumnName.raw}
      |) values (?, ?, cast(? as jsonb), ?)
      |""".stripMargin)

private def deleteEntityRowsSql[A](table: DeliveryEntityTable[A]): SqlStatement =
  new SqlStatement(s"delete from ${table.tableName.raw}")

private def loadEntityRowsSql[A](table: DeliveryEntityTable[A]): SqlStatement =
  new SqlStatement(s"""
      |select ${DeliveryPersistenceDefaults.PayloadColumnName.raw}::text
      |from ${table.tableName.raw}
      |order by ${DeliveryPersistenceDefaults.PositionColumnName.raw} asc
      |""".stripMargin)

def executeSqlStatement(connection: Connection, sql: SqlStatement): IO[Unit] =
  IO.blocking(executeBlockingSqlStatement(connection, sql))

def executeBlockingSqlStatement(connection: Connection, sql: SqlStatement): Unit =
  val statement = connection.createStatement()
  try
    statement.execute(sql.raw)
    ()
  finally statement.close()

def tableExists(connection: Connection, tableName: TableName): Boolean =
  val metaData = connection.getMetaData
  val resultSet = metaData.getTables(null, null, tableName.raw, Array("TABLE"))
  try resultSet.next()
  finally resultSet.close()

def readJsonPayload(resultSet: ResultSet, columnIndex: Int): JsonPayload =
  new JsonPayload(resultSet.getString(columnIndex))

def renderJsonPayload[A: Encoder](value: A): JsonPayload =
  new JsonPayload(deliveryStateJsonPrinter.print(value.asJson))

private def sequenceDecodedRows[A](
    rows: List[Either[IllegalStateException, A]]
): Either[IllegalStateException, List[A]] =
  rows.foldRight(Right(List.empty[A]): Either[IllegalStateException, List[A]]) { (row, accumulated) =>
    for
      value <- row
      values <- accumulated
    yield value :: values
  }

def decodeJsonRow[A: Decoder](rawJson: JsonPayload, tableName: TableName): Either[IllegalStateException, A] =
  decode[A](rawJson.raw).left.map(error =>
    IllegalStateException(
        s"无法解析数据库中的业务状态 ${tableName.raw}: ${error.getMessage}",
        error,
      )
  )
