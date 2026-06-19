package system.app.planner

// Business note: demo planner workflow code; keep planner API DTOs separate from application state objects.
import system.objects.given

import cats.effect.IO
import org.typelevel.log4cats.slf4j.Slf4jLogger
import system.app.planner.objects.{DemoNote, PlannerName, SaveDemoNoteRequest}
import system.app.planner.table.insertNote

import java.sql.Connection

private val saveDemoNotePlannerLogger = Slf4jLogger.getLogger[IO]
val saveDemoNotePlannerName: PlannerName = new PlannerName("SaveDemoNotePlanner")

def runSaveDemoNotePlanner(request: SaveDemoNoteRequest, connection: Connection): IO[DemoNote] =
  for
    _ <- saveDemoNotePlannerLogger.info(s"SaveDemoNotePlanner started, title=${request.title.value}")
    note <- insertNote(connection, request)
    _ <- saveDemoNotePlannerLogger.info(s"SaveDemoNotePlanner finished, noteId=${note.id.value}")
  yield note
