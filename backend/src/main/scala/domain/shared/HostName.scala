package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class HostName(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object HostName:
  given WrappedTextType[HostName] = wrappedTextType(value => new HostName(value), _.value)
