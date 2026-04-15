package shared.app.planner

import domain.shared.given

import cats.effect.IO
import domain.shared.{DemoNote, PlannerName, SaveDemoNoteRequest}
import shared.database.insertNote
import org.typelevel.log4cats.slf4j.Slf4jLogger

import java.sql.Connection

private val saveDemoNotePlannerLogger = Slf4jLogger.getLogger[IO]
val saveDemoNotePlannerName: PlannerName = new PlannerName("SaveDemoNotePlanner")

def runSaveDemoNotePlanner(request: SaveDemoNoteRequest, connection: Connection): IO[DemoNote] =
  for
    _ <- saveDemoNotePlannerLogger.info(s"SaveDemoNotePlanner started, title=${request.title.value}")
    note <- insertNote(connection, request)
    _ <- saveDemoNotePlannerLogger.info(s"SaveDemoNotePlanner finished, noteId=${note.id.value}")
  yield note
