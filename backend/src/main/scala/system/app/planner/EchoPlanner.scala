package system.app.planner

// Business note: demo planner workflow code; keep planner API DTOs separate from application state objects.
import system.objects.given

import cats.effect.IO
import system.objects.DisplayText
import org.typelevel.log4cats.slf4j.Slf4jLogger
import system.app.planner.objects.{EchoRequest, EchoResponse, PlannerName}

private val echoPlannerLogger = Slf4jLogger.getLogger[IO]
val echoPlannerName: PlannerName = new PlannerName("EchoPlanner")

def runEchoPlanner(request: EchoRequest): IO[EchoResponse] =
  for
    _ <- echoPlannerLogger.info(s"EchoPlanner started, message=${request.message}")
    response = EchoResponse(
      message = if request.uppercase then new DisplayText(request.message.raw.toUpperCase) else request.message,
      transformed = request.uppercase
    )
    _ <- echoPlannerLogger.info("EchoPlanner finished")
  yield response
