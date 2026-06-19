package system.app.planner.objects

// Business note: planner-owned demo object; keep frontend planner mirrors aligned when this shape crosses the planner API boundary.
import system.objects.given

import system.objects.*


final class PlannerName(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object PlannerName:
  given WrappedTextType[PlannerName] = wrappedTextType(value => new PlannerName(value), _.value)
