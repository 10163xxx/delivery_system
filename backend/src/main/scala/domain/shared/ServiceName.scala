package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class ServiceName(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object ServiceName:
  given WrappedTextType[ServiceName] = wrappedTextType(value => new ServiceName(value), _.value)
