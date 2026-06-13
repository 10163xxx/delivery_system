package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class ServiceStatus(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object ServiceStatus:
  given WrappedTextType[ServiceStatus] = wrappedTextType(value => new ServiceStatus(value), _.value)
