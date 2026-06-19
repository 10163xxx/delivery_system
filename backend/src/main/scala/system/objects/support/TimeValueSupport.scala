package system.objects

import java.time.{Instant, LocalTime}

def isoDateTime(value: String): IsoDateTime = wrapText[IsoDateTime](value)

def isoDateTimeFromInstant(value: Instant): IsoDateTime =
  isoDateTime(value.toString)

def currentIsoDateTime(): IsoDateTime =
  isoDateTimeFromInstant(Instant.now())

def parseIsoInstant(value: IsoDateTime): Option[Instant] =
  try Some(Instant.parse(value.raw))
  catch case _: Exception => None

def timeOfDay(value: String): TimeOfDay = wrapText[TimeOfDay](value)

def timeOfDayFromLocalTime(value: LocalTime): TimeOfDay =
  timeOfDay(value.toString)

def parseLocalClockTime(value: TimeOfDay): Option[LocalTime] =
  try Some(LocalTime.parse(value.raw))
  catch case _: Exception => None
