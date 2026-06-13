package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class RefundRequestId(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object RefundRequestId:
  given WrappedTextType[RefundRequestId] = wrappedTextType(value => new RefundRequestId(value), _.value)
  given Conversion[String, RefundRequestId] = value => new RefundRequestId(value)
  given Conversion[RefundRequestId, EntityId] = value => new EntityId(value.value)
