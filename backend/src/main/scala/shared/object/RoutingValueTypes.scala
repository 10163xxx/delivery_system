package domain.shared

import domain.shared.given

final class RouteSegmentText(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object RouteSegmentText:
  given WrappedTextType[RouteSegmentText] = wrappedTextType(value => new RouteSegmentText(value), _.value)
