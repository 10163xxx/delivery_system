package shared.app

import domain.shared.given

import domain.shared.*

// Shared text rendering and sanitizing helpers for validation code.
def validationText(value: String): DisplayText = wrapText[DisplayText](value)

def validationShowValue[T](value: T)(using renderer: DisplayTextRenderer[T]): DisplayText =
  renderer.render(value)

def joinValidationText(parts: DisplayText*): DisplayText =
  wrapText[DisplayText](parts.map(_.raw).mkString)

def joinValidationError(parts: DisplayText*): ErrorMessage =
  wrapText[ErrorMessage](joinValidationText(parts*).raw)

def sanitizeRequiredText(
    value: DisplayText,
    maxLength: EntityCount,
    errorMessage: ErrorMessage,
): Either[ErrorMessage, DisplayText] =
  val sanitized = sanitizeText(value, maxLength)
  Either.cond(sanitized.nonEmpty, sanitized, errorMessage)

def sanitizeRequiredText[T](
    value: T,
    maxLength: EntityCount,
    errorMessage: ErrorMessage,
)(using wrapped: WrappedTextType[T]): Either[ErrorMessage, T] =
  val sanitized = sanitizeText(wrapText[DisplayText](value.raw), maxLength)
  Either.cond(sanitized.nonEmpty, wrapText(sanitized.raw), errorMessage)

def sanitizeOptionalText(value: Option[DisplayText], maxLength: EntityCount): Option[DisplayText] =
  value.flatMap(text =>
    sanitizeText(text, maxLength) match
      case sanitized if sanitized.isEmpty => None
      case sanitized => Some(sanitized)
  )

def sanitizeOptionalText[T](value: Option[T], maxLength: EntityCount)(using
    wrapped: WrappedTextType[T]
): Option[T] =
  value.flatMap(text =>
    sanitizeText(wrapText[DisplayText](text.raw), maxLength) match
      case sanitized if sanitized.isEmpty => None
      case sanitized => Some(wrapText(sanitized.raw))
  )

def sanitizeText(value: DisplayText, maxLength: EntityCount): DisplayText =
  wrapText[DisplayText](
    value.raw
      .trim
      .filter(character => !Character.isISOControl(character) || character == '\n' || character == '\t')
      .replace('\n', ' ')
      .replace('\t', ' ')
      .split(' ')
      .filter(_.nonEmpty)
      .mkString(" ")
      .take(maxLength)
  )
