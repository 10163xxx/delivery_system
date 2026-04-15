package shared.app.planner

import domain.shared.given

import cats.effect.IO
import domain.shared.{DisplayText, EchoRequest, EchoResponse, PlannerName}
import org.typelevel.log4cats.slf4j.Slf4jLogger

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
