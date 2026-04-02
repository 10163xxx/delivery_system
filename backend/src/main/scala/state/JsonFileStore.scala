package state

import io.circe.{Decoder, Encoder, Printer}
import io.circe.parser.decode
import io.circe.syntax.*

import java.nio.charset.StandardCharsets
import java.nio.file.{Files, Path, StandardCopyOption, StandardOpenOption}

object JsonFileStore:

  private val printer = Printer.spaces2SortKeys

  def loadOrCreate[A: Encoder: Decoder](path: Path, seed: => A): A =
    ensureParentDirectory(path)

    if Files.exists(path) then
      val content = Files.readString(path, StandardCharsets.UTF_8).trim
      if content.nonEmpty then
        decode[A](content).fold(
          error => throw IllegalStateException(s"无法解析状态文件 ${path.toAbsolutePath}: ${error.getMessage}", error),
          identity,
        )
      else
        val initial = seed
        write(path, initial)
        initial
    else
      val initial = seed
      write(path, initial)
      initial

  def write[A: Encoder](path: Path, value: A): Unit =
    ensureParentDirectory(path)

    val tempPath = path.resolveSibling(s".${path.getFileName.toString}.tmp")
    Files.writeString(
      tempPath,
      printer.print(value.asJson),
      StandardCharsets.UTF_8,
      StandardOpenOption.CREATE,
      StandardOpenOption.TRUNCATE_EXISTING,
      StandardOpenOption.WRITE,
    )

    try
      Files.move(
        tempPath,
        path,
        StandardCopyOption.REPLACE_EXISTING,
        StandardCopyOption.ATOMIC_MOVE,
      )
    catch
      case _: java.nio.file.AtomicMoveNotSupportedException =>
        Files.move(tempPath, path, StandardCopyOption.REPLACE_EXISTING)

  private def ensureParentDirectory(path: Path): Unit =
    Option(path.getParent).foreach(parent => Files.createDirectories(parent))
