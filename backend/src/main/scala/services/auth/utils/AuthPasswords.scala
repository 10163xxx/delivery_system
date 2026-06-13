package services.auth.utils

import domain.shared.Password
import domain.shared.PasswordHash

import java.nio.charset.StandardCharsets
import java.security.MessageDigest
import java.util.HexFormat

def hashPassword(password: Password): PasswordHash =
  val digest = MessageDigest.getInstance("SHA-256")
  val hashed = digest.digest(password.raw.getBytes(StandardCharsets.UTF_8))
  new PasswordHash(HexFormat.of().formatHex(hashed))

def passwordMatches(password: Password, passwordHash: PasswordHash): Boolean =
  hashPassword(password).raw == passwordHash.raw
