package system.objects

import io.circe.{Decoder, Encoder}

def enumDisplayText[E](value: E): DisplayText =
  text(value.toString)

def parseEnumValue[E](value: DisplayText, values: Array[E]): Option[E] =
  values.find(_.toString == value.raw)

def enumEncoder[E]: Encoder[E] =
  Encoder.encodeString.contramap(value => enumDisplayText(value).raw)

def enumDecoder[E](values: Array[E], label: DisplayText): Decoder[E] =
  Decoder.decodeString.emap { raw =>
    parseEnumValue(text(raw), values).toRight(s"Invalid ${label.raw}: $raw")
  }
