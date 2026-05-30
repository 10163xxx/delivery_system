package table

import domain.shared.given

import domain.shared.*

import java.sql.{PreparedStatement, ResultSet, Timestamp}
import java.time.Instant

def setWrappedText[T](statement: PreparedStatement, index: ParameterIndex, value: T)(using wrapped: WrappedTextType[T]): Unit =
  statement.setString(index.raw, value.raw)

def setOptionalWrappedText[T](
    statement: PreparedStatement,
    index: ParameterIndex,
    value: Option[T],
)(using wrapped: WrappedTextType[T]): Unit =
  statement.setString(index.raw, value.map(wrapped.toRaw).orNull)

def setIsoDateTime(statement: PreparedStatement, index: ParameterIndex, value: IsoDateTime): Unit =
  statement.setTimestamp(index.raw, Timestamp.from(Instant.parse(value.raw)))

def readWrappedText[T](resultSet: ResultSet, column: ColumnName)(using wrapped: WrappedTextType[T]): T =
  wrapText[T](resultSet.getString(column.raw))

def readOptionalWrappedText[T](resultSet: ResultSet, column: ColumnName)(using wrapped: WrappedTextType[T]): Option[T] =
  Option(resultSet.getString(column.raw)).map(wrapText[T])

def readIsoDateTime(resultSet: ResultSet, column: ColumnName): IsoDateTime =
  new IsoDateTime(resultSet.getTimestamp(column.raw).toInstant.toString)

def setUserRole(statement: PreparedStatement, index: ParameterIndex, role: UserRole): Unit =
  statement.setString(index.raw, UserRole.render(role).raw)

def readUserRole(resultSet: ResultSet, column: ColumnName): UserRole =
  UserRole
    .parse(readWrappedText[DisplayText](resultSet, column))
    .getOrElse(throw IllegalStateException(s"Invalid UserRole in column ${column.raw}"))
