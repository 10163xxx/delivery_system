package services.auth.utils

// Business note: service business action/support code; keep validation and state transitions explicit and side effects in IO.
import services.auth.objects.Password
import services.auth.objects.PasswordHash

import java.nio.charset.StandardCharsets
import java.security.MessageDigest
import java.util.HexFormat

def hashPassword(password: Password): PasswordHash =
  val digest = MessageDigest.getInstance("SHA-256")
  val hashed = digest.digest(password.raw.getBytes(StandardCharsets.UTF_8))
  new PasswordHash(HexFormat.of().formatHex(hashed))

def passwordMatches(password: Password, passwordHash: PasswordHash): Boolean =
  hashPassword(password).raw == passwordHash.raw
