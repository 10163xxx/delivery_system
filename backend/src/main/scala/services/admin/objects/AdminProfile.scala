package services.admin.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import system.objects.*

final case class AdminProfile(
    id: AdminId,
    name: PersonName,
    platformIncomeCents: CurrencyCents,
)
object AdminProfile:
  given Encoder[AdminProfile] = deriveEncoder
  given Decoder[AdminProfile] = Decoder.instance { cursor =>
    for
      id <- cursor.get[AdminId]("id")
      name <- cursor.get[PersonName]("name")
      platformIncomeCents <- cursor.getOrElse[CurrencyCents]("platformIncomeCents")(NumericDefaults.ZeroCurrencyCents)
    yield AdminProfile(
      id = id,
      name = name,
      platformIncomeCents = platformIncomeCents,
    )
  }
