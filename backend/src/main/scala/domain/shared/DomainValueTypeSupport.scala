package domain.shared

import io.circe.{Decoder, Encoder, KeyDecoder, KeyEncoder}

import scala.language.implicitConversions

trait WrappedTextType[T]:
  def fromRaw(value: String): T
  def toRaw(value: T): String

def wrappedTextType[T](build: String => T, extract: T => String): WrappedTextType[T] =
  new WrappedTextType[T]:
    def fromRaw(value: String): T = build(value)
    def toRaw(value: T): String = extract(value)

def wrapText[T](value: String)(using wrapped: WrappedTextType[T]): T =
  wrapped.fromRaw(value)

extension [T](value: T)(using wrapped: WrappedTextType[T])
  def raw: String = wrapped.toRaw(value)
  def length: Int = value.raw.length
  def isEmpty: Boolean = value.raw.isEmpty
  def nonEmpty: Boolean = value.raw.nonEmpty

given wrappedTextEncoder[T](using wrapped: WrappedTextType[T]): Encoder[T] =
  Encoder.encodeString.contramap(wrapped.toRaw)

given wrappedTextDecoder[T](using wrapped: WrappedTextType[T]): Decoder[T] =
  Decoder.decodeString.map(wrapText[T])

given wrappedTextKeyEncoder[T](using wrapped: WrappedTextType[T]): KeyEncoder[T] =
  value => wrapped.toRaw(value)

given wrappedTextKeyDecoder[T](using wrapped: WrappedTextType[T]): KeyDecoder[T] =
  value => Some(wrapText[T](value))

given wrappedTextOrdering[T](using wrapped: WrappedTextType[T]): Ordering[T] =
  Ordering.by(wrapped.toRaw)

trait WrappedIntType[T]:
  def fromRaw(value: Int): T
  def toRaw(value: T): Int

def wrappedIntType[T](build: Int => T, extract: T => Int): WrappedIntType[T] =
  new WrappedIntType[T]:
    def fromRaw(value: Int): T = build(value)
    def toRaw(value: T): Int = extract(value)

def wrapInt[T](value: Int)(using wrapped: WrappedIntType[T]): T =
  wrapped.fromRaw(value)

extension [T](value: T)(using wrapped: WrappedIntType[T])
  def raw: Int = wrapped.toRaw(value)

given wrappedIntEncoder[T](using wrapped: WrappedIntType[T]): Encoder[T] =
  Encoder.encodeInt.contramap(wrapped.toRaw)

given wrappedIntDecoder[T](using wrapped: WrappedIntType[T]): Decoder[T] =
  Decoder.decodeInt.map(wrapInt[T])

given wrappedIntToRawConversion[T](using wrapped: WrappedIntType[T]): Conversion[T, Int] =
  wrapped.toRaw

given rawToWrappedIntConversion[T](using wrapped: WrappedIntType[T]): Conversion[Int, T] =
  wrapped.fromRaw

given wrappedIntOrdering[T](using wrapped: WrappedIntType[T]): Ordering[T] =
  Ordering.by(wrapped.toRaw)

given wrappedIntNumeric[T](using wrapped: WrappedIntType[T]): Numeric[T] with
  def plus(x: T, y: T): T = wrapInt(wrapped.toRaw(x) + wrapped.toRaw(y))
  def minus(x: T, y: T): T = wrapInt(wrapped.toRaw(x) - wrapped.toRaw(y))
  def times(x: T, y: T): T = wrapInt(wrapped.toRaw(x) * wrapped.toRaw(y))
  def negate(x: T): T = wrapInt(-wrapped.toRaw(x))
  def fromInt(x: Int): T = wrapInt(x)
  def parseString(str: String): Option[T] = str.toIntOption.map(wrapInt[T])
  def toInt(x: T): Int = wrapped.toRaw(x)
  def toLong(x: T): Long = wrapped.toRaw(x).toLong
  def toFloat(x: T): Float = wrapped.toRaw(x).toFloat
  def toDouble(x: T): Double = wrapped.toRaw(x).toDouble
  def compare(x: T, y: T): Int = wrapped.toRaw(x).compare(wrapped.toRaw(y))

trait WrappedLongType[T]:
  def fromRaw(value: Long): T
  def toRaw(value: T): Long

def wrappedLongType[T](build: Long => T, extract: T => Long): WrappedLongType[T] =
  new WrappedLongType[T]:
    def fromRaw(value: Long): T = build(value)
    def toRaw(value: T): Long = extract(value)

def wrapLong[T](value: Long)(using wrapped: WrappedLongType[T]): T =
  wrapped.fromRaw(value)

extension [T](value: T)(using wrapped: WrappedLongType[T])
  def raw: Long = wrapped.toRaw(value)

given wrappedLongEncoder[T](using wrapped: WrappedLongType[T]): Encoder[T] =
  Encoder.encodeLong.contramap(wrapped.toRaw)

given wrappedLongDecoder[T](using wrapped: WrappedLongType[T]): Decoder[T] =
  Decoder.decodeLong.map(wrapLong[T])

given wrappedLongToRawConversion[T](using wrapped: WrappedLongType[T]): Conversion[T, Long] =
  wrapped.toRaw

given rawToWrappedLongConversion[T](using wrapped: WrappedLongType[T]): Conversion[Long, T] =
  wrapped.fromRaw

given wrappedLongOrdering[T](using wrapped: WrappedLongType[T]): Ordering[T] =
  Ordering.by(wrapped.toRaw)

given wrappedLongNumeric[T](using wrapped: WrappedLongType[T]): Numeric[T] with
  def plus(x: T, y: T): T = wrapLong(wrapped.toRaw(x) + wrapped.toRaw(y))
  def minus(x: T, y: T): T = wrapLong(wrapped.toRaw(x) - wrapped.toRaw(y))
  def times(x: T, y: T): T = wrapLong(wrapped.toRaw(x) * wrapped.toRaw(y))
  def negate(x: T): T = wrapLong(-wrapped.toRaw(x))
  def fromInt(x: Int): T = wrapLong(x.toLong)
  def parseString(str: String): Option[T] = str.toLongOption.map(wrapLong[T])
  def toInt(x: T): Int = wrapped.toRaw(x).toInt
  def toLong(x: T): Long = wrapped.toRaw(x)
  def toFloat(x: T): Float = wrapped.toRaw(x).toFloat
  def toDouble(x: T): Double = wrapped.toRaw(x).toDouble
  def compare(x: T, y: T): Int = wrapped.toRaw(x).compare(wrapped.toRaw(y))

trait WrappedDoubleType[T]:
  def fromRaw(value: Double): T
  def toRaw(value: T): Double

def wrappedDoubleType[T](build: Double => T, extract: T => Double): WrappedDoubleType[T] =
  new WrappedDoubleType[T]:
    def fromRaw(value: Double): T = build(value)
    def toRaw(value: T): Double = extract(value)

def wrapDouble[T](value: Double)(using wrapped: WrappedDoubleType[T]): T =
  wrapped.fromRaw(value)

extension [T](value: T)(using wrapped: WrappedDoubleType[T])
  def raw: Double = wrapped.toRaw(value)

given wrappedDoubleEncoder[T](using wrapped: WrappedDoubleType[T]): Encoder[T] =
  Encoder.encodeDouble.contramap(wrapped.toRaw)

given wrappedDoubleDecoder[T](using wrapped: WrappedDoubleType[T]): Decoder[T] =
  Decoder.decodeDouble.map(wrapDouble[T])

given wrappedDoubleToRawConversion[T](using wrapped: WrappedDoubleType[T]): Conversion[T, Double] =
  wrapped.toRaw

given rawToWrappedDoubleConversion[T](using wrapped: WrappedDoubleType[T]): Conversion[Double, T] =
  wrapped.fromRaw

given wrappedDoubleOrdering[T](using wrapped: WrappedDoubleType[T]): Ordering[T] =
  Ordering.by(wrapped.toRaw)

given wrappedDoubleFractional[T](using wrapped: WrappedDoubleType[T]): Fractional[T] with
  def plus(x: T, y: T): T = wrapDouble(wrapped.toRaw(x) + wrapped.toRaw(y))
  def minus(x: T, y: T): T = wrapDouble(wrapped.toRaw(x) - wrapped.toRaw(y))
  def times(x: T, y: T): T = wrapDouble(wrapped.toRaw(x) * wrapped.toRaw(y))
  def div(x: T, y: T): T = wrapDouble(wrapped.toRaw(x) / wrapped.toRaw(y))
  def negate(x: T): T = wrapDouble(-wrapped.toRaw(x))
  def fromInt(x: Int): T = wrapDouble(x.toDouble)
  def parseString(str: String): Option[T] = str.toDoubleOption.map(wrapDouble[T])
  def toInt(x: T): Int = wrapped.toRaw(x).toInt
  def toLong(x: T): Long = wrapped.toRaw(x).toLong
  def toFloat(x: T): Float = wrapped.toRaw(x).toFloat
  def toDouble(x: T): Double = wrapped.toRaw(x)
  def compare(x: T, y: T): Int = wrapped.toRaw(x).compare(wrapped.toRaw(y))

trait WrappedBooleanType[T]:
  def fromRaw(value: Boolean): T
  def toRaw(value: T): Boolean

def wrappedBooleanType[T](build: Boolean => T, extract: T => Boolean): WrappedBooleanType[T] =
  new WrappedBooleanType[T]:
    def fromRaw(value: Boolean): T = build(value)
    def toRaw(value: T): Boolean = extract(value)

def wrapBoolean[T](value: Boolean)(using wrapped: WrappedBooleanType[T]): T =
  wrapped.fromRaw(value)

extension [T](value: T)(using wrapped: WrappedBooleanType[T])
  def raw: Boolean = wrapped.toRaw(value)

given wrappedBooleanEncoder[T](using wrapped: WrappedBooleanType[T]): Encoder[T] =
  Encoder.encodeBoolean.contramap(wrapped.toRaw)

given wrappedBooleanDecoder[T](using wrapped: WrappedBooleanType[T]): Decoder[T] =
  Decoder.decodeBoolean.map(wrapBoolean[T])

given wrappedBooleanToRawConversion[T](using wrapped: WrappedBooleanType[T]): Conversion[T, Boolean] =
  wrapped.toRaw

given rawToWrappedBooleanConversion[T](using wrapped: WrappedBooleanType[T]): Conversion[Boolean, T] =
  wrapped.fromRaw

trait DisplayTextRenderer[T]:
  def render(value: T): DisplayText

object DisplayTextRenderer:
  given DisplayTextRenderer[DisplayText] with
    def render(value: DisplayText): DisplayText = value

  given [T](using wrapped: WrappedTextType[T]): DisplayTextRenderer[T] with
    def render(value: T): DisplayText = new DisplayText(value.raw)

  given DisplayTextRenderer[BigDecimal] with
    def render(value: BigDecimal): DisplayText = new DisplayText(String.valueOf(value))

  given wrappedIntDisplayTextRenderer[T](using wrapped: WrappedIntType[T]): DisplayTextRenderer[T] with
    def render(value: T): DisplayText = new DisplayText(String.valueOf(wrapped.toRaw(value)))

  given wrappedLongDisplayTextRenderer[T](using wrapped: WrappedLongType[T]): DisplayTextRenderer[T] with
    def render(value: T): DisplayText = new DisplayText(String.valueOf(wrapped.toRaw(value)))

  given wrappedDoubleDisplayTextRenderer[T](using wrapped: WrappedDoubleType[T]): DisplayTextRenderer[T] with
    def render(value: T): DisplayText = new DisplayText(String.valueOf(wrapped.toRaw(value)))
