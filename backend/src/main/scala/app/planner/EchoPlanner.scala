package app.planner

import cats.effect.IO
import domain.shared.{EchoRequest, EchoResponse}
import org.typelevel.log4cats.slf4j.Slf4jLogger

private val echoPlannerLogger = Slf4jLogger.getLogger[IO]

def runEchoPlanner(request: EchoRequest): IO[EchoResponse] =
  for
    _ <- echoPlannerLogger.info(s"EchoPlanner started, message=${request.message}")
    response = EchoResponse(
      message = if request.uppercase then request.message.toUpperCase else request.message,
      transformed = request.uppercase
    )
    _ <- echoPlannerLogger.info("EchoPlanner finished")
  yield response

val echoPlanner: PlainPlanner[EchoRequest, EchoResponse] =
  PlainPlanner(
    name = "EchoPlanner",
    run = runEchoPlanner,
  )
