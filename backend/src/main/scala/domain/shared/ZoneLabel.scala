package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class ZoneLabel(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object ZoneLabel:
  given WrappedTextType[ZoneLabel] = wrappedTextType(value => new ZoneLabel(value), _.value)
