package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class ApprovalFlag(val value: Boolean) extends AnyVal:
  override def toString: String = String.valueOf(value)
  def raw: Boolean = value
object ApprovalFlag:
  given WrappedBooleanType[ApprovalFlag] = wrappedBooleanType(value => new ApprovalFlag(value), _.value)
  given Conversion[Boolean, ApprovalFlag] = value => new ApprovalFlag(value)
  given Conversion[ApprovalFlag, Boolean] = _.value
