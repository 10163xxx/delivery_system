package app.planner

import cats.effect.IO
import domain.shared.{DemoNote, SaveDemoNoteRequest}
import tables.NoteTable
import org.typelevel.log4cats.slf4j.Slf4jLogger

import java.sql.Connection

private val saveDemoNotePlannerLogger = Slf4jLogger.getLogger[IO]

def runSaveDemoNotePlanner(request: SaveDemoNoteRequest, connection: Connection): IO[DemoNote] =
  for
    _ <- saveDemoNotePlannerLogger.info(s"SaveDemoNotePlanner started, title=${request.title.value}")
    note <- NoteTable.insert(connection, request)
    _ <- saveDemoNotePlannerLogger.info(s"SaveDemoNotePlanner finished, noteId=${note.id.value}")
  yield note

val saveDemoNotePlanner: ConnectionPlanner[SaveDemoNoteRequest, DemoNote] =
  ConnectionPlanner(
    name = "SaveDemoNotePlanner",
    run = runSaveDemoNotePlanner,
  )
