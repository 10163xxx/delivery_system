package system.api

import cats.effect.IO
import domain.shared.{RoutePath, RouteSegmentText, WrappedTextType, wrapText}
import org.http4s.{Method, Request}

final case class StaticRouteSegment(value: RouteSegmentText)

def routeSegment(value: String): StaticRouteSegment =
  StaticRouteSegment(new RouteSegmentText(value))

trait PathParamCodec[T]:
  def parse(raw: RouteSegmentText): Option[T]
  def render(value: T): RouteSegmentText

object PathParamCodec:
  given wrappedTextPathParamCodec[T](using wrapped: WrappedTextType[T]): PathParamCodec[T] with
    def parse(raw: RouteSegmentText): Option[T] = Some(wrapText[T](raw.raw))
    def render(value: T): RouteSegmentText = new RouteSegmentText(wrapped.toRaw(value))

final case class FixedMethodApi0[Response](method: Method, segments: List[StaticRouteSegment])

final case class FixedMethodApi1[Param, Response](
    method: Method,
    prefixSegments: List[StaticRouteSegment],
    suffixSegments: List[StaticRouteSegment],
)

final case class FixedMethodApi2[FirstParam, SecondParam, Response](
    method: Method,
    prefixSegments: List[StaticRouteSegment],
    middleSegments: List[StaticRouteSegment],
    suffixSegments: List[StaticRouteSegment],
)

def jsonGetApi0[Response](segments: StaticRouteSegment*): FixedMethodApi0[Response] =
  FixedMethodApi0(Method.GET, segments.toList)

def jsonGetApi1[Param, Response](
    prefixSegments: List[StaticRouteSegment],
    suffixSegments: List[StaticRouteSegment] = Nil,
): FixedMethodApi1[Param, Response] =
  FixedMethodApi1(Method.GET, prefixSegments, suffixSegments)

def jsonPostApi0[Body, Response](segments: StaticRouteSegment*): FixedMethodApi0[Response] =
  FixedMethodApi0(Method.POST, segments.toList)

def jsonPostApi1[Param, Body, Response](
    prefixSegments: List[StaticRouteSegment],
    suffixSegments: List[StaticRouteSegment] = Nil,
): FixedMethodApi1[Param, Response] =
  FixedMethodApi1(Method.POST, prefixSegments, suffixSegments)

def jsonPostApi2[FirstParam, SecondParam, Body, Response](
    prefixSegments: List[StaticRouteSegment],
    middleSegments: List[StaticRouteSegment],
    suffixSegments: List[StaticRouteSegment] = Nil,
): FixedMethodApi2[FirstParam, SecondParam, Response] =
  FixedMethodApi2(Method.POST, prefixSegments, middleSegments, suffixSegments)

private def requestSegments(req: Request[IO]): List[RouteSegmentText] =
  req.uri.path.renderString.split('/').filter(_.nonEmpty).toList.map(segment => new RouteSegmentText(segment))

private def staticSegmentValues(segments: List[StaticRouteSegment]): List[RouteSegmentText] =
  segments.map(_.value)

private def buildRoutePath(segments: List[RouteSegmentText]): RoutePath =
  new RoutePath(s"/${segments.map(_.raw).mkString("/")}")

def matchesApi0[Response](api: FixedMethodApi0[Response], req: Request[IO]): Boolean =
  req.method == api.method && requestSegments(req) == staticSegmentValues(api.segments)

def matchesApi1[Param, Response](
    api: FixedMethodApi1[Param, Response],
    req: Request[IO],
)(using codec: PathParamCodec[Param]): Boolean =
  extractApi1(api, req).nonEmpty

def matchesApi2[FirstParam, SecondParam, Response](
    api: FixedMethodApi2[FirstParam, SecondParam, Response],
    req: Request[IO],
)(using firstCodec: PathParamCodec[FirstParam], secondCodec: PathParamCodec[SecondParam]): Boolean =
  extractApi2(api, req).nonEmpty

def extractApi0[Response](
    api: FixedMethodApi0[Response],
    req: Request[IO],
): Option[Request[IO]] =
  Option.when(matchesApi0(api, req))(req)

def extractApi1[Param, Response](
    api: FixedMethodApi1[Param, Response],
    req: Request[IO],
)(using codec: PathParamCodec[Param]): Option[(Request[IO], Param)] =
  if req.method != api.method then None
  else
    val expectedPrefix = staticSegmentValues(api.prefixSegments)
    val expectedSuffix = staticSegmentValues(api.suffixSegments)
    requestSegments(req) match
      case segments
          if segments.length == expectedPrefix.length + expectedSuffix.length + 1 &&
            segments.take(expectedPrefix.length) == expectedPrefix &&
            segments.takeRight(expectedSuffix.length) == expectedSuffix =>
        codec.parse(segments(expectedPrefix.length)).map(value => (req, value))
      case _ => None

def extractApi2[FirstParam, SecondParam, Response](
    api: FixedMethodApi2[FirstParam, SecondParam, Response],
    req: Request[IO],
)(using firstCodec: PathParamCodec[FirstParam], secondCodec: PathParamCodec[SecondParam]): Option[(Request[IO], FirstParam, SecondParam)] =
  if req.method != api.method then None
  else
    val expectedPrefix = staticSegmentValues(api.prefixSegments)
    val expectedMiddle = staticSegmentValues(api.middleSegments)
    val expectedSuffix = staticSegmentValues(api.suffixSegments)
    requestSegments(req) match
      case segments
          if segments.length == expectedPrefix.length + expectedMiddle.length + expectedSuffix.length + 2 &&
            segments.take(expectedPrefix.length) == expectedPrefix &&
            segments.slice(expectedPrefix.length + 1, expectedPrefix.length + 1 + expectedMiddle.length) == expectedMiddle &&
            segments.takeRight(expectedSuffix.length) == expectedSuffix =>
        val firstRaw = segments(expectedPrefix.length)
        val secondRaw = segments(expectedPrefix.length + expectedMiddle.length + 1)
        for
          first <- firstCodec.parse(firstRaw)
          second <- secondCodec.parse(secondRaw)
        yield (req, first, second)
      case _ => None

def apiPath0[Response](api: FixedMethodApi0[Response]): RoutePath =
  buildRoutePath(staticSegmentValues(api.segments))

def apiPath1[Param, Response](
    api: FixedMethodApi1[Param, Response],
    param: Param,
)(using codec: PathParamCodec[Param]): RoutePath =
  buildRoutePath(
    staticSegmentValues(api.prefixSegments) ++
      List(codec.render(param)) ++
      staticSegmentValues(api.suffixSegments)
  )

def apiPath2[FirstParam, SecondParam, Response](
    api: FixedMethodApi2[FirstParam, SecondParam, Response],
    first: FirstParam,
    second: SecondParam,
)(using firstCodec: PathParamCodec[FirstParam], secondCodec: PathParamCodec[SecondParam]): RoutePath =
  buildRoutePath(
    staticSegmentValues(api.prefixSegments) ++
      List(firstCodec.render(first)) ++
      staticSegmentValues(api.middleSegments) ++
      List(secondCodec.render(second)) ++
      staticSegmentValues(api.suffixSegments)
  )
