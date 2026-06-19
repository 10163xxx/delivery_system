package system.objects

import system.objects.given

final class TableName(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object TableName:
  given WrappedTextType[TableName] = wrappedTextType(value => new TableName(value), _.value)

final class ColumnName(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object ColumnName:
  given WrappedTextType[ColumnName] = wrappedTextType(value => new ColumnName(value), _.value)

final class StateKey(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object StateKey:
  given WrappedTextType[StateKey] = wrappedTextType(value => new StateKey(value), _.value)

final class JsonPayload(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object JsonPayload:
  given WrappedTextType[JsonPayload] = wrappedTextType(value => new JsonPayload(value), _.value)
