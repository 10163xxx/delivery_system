package system.api

import cats.data.OptionT
import cats.effect.IO
import domain.shared.{RoutePath, RouteSegmentText, WrappedTextType, wrapText}
import org.http4s.{HttpRoutes, Method, Request, Response}

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

type NoPathParams = EmptyTuple.type
type PathParam[Param] = Param *: EmptyTuple
type PathParams[FirstParam, SecondParam] = FirstParam *: SecondParam *: EmptyTuple
type ExtractedApiRequest[Params <: Tuple] = Params match
  case NoPathParams => Request[IO]
  case param *: EmptyTuple => (Request[IO], param)
  case firstParam *: secondParam *: EmptyTuple => (Request[IO], firstParam, secondParam)

sealed trait FixedMethodApi[Params <: Tuple, Response]:
  def method: Method

private final case class StaticFixedMethodApi[Response](
    method: Method,
    segments: List[StaticRouteSegment],
) extends FixedMethodApi[NoPathParams, Response]

private final case class SingleParamFixedMethodApi[Param, Response](
    method: Method,
    prefixSegments: List[StaticRouteSegment],
    suffixSegments: List[StaticRouteSegment] = Nil,
) extends FixedMethodApi[PathParam[Param], Response]

private final case class DoubleParamFixedMethodApi[FirstParam, SecondParam, Response](
    method: Method,
    prefixSegments: List[StaticRouteSegment],
    middleSegments: List[StaticRouteSegment],
    suffixSegments: List[StaticRouteSegment],
) extends FixedMethodApi[PathParams[FirstParam, SecondParam], Response]

def jsonGetApi[Response](segments: StaticRouteSegment*): FixedMethodApi[NoPathParams, Response] =
  StaticFixedMethodApi(Method.GET, segments.toList)

def jsonGetApi[Param, Response](
    prefixSegments: List[StaticRouteSegment],
    suffixSegments: List[StaticRouteSegment] = Nil,
): FixedMethodApi[PathParam[Param], Response] =
  SingleParamFixedMethodApi(Method.GET, prefixSegments, suffixSegments)

def jsonPostApi[Body, Response](segments: StaticRouteSegment*): FixedMethodApi[NoPathParams, Response] =
  StaticFixedMethodApi(Method.POST, segments.toList)

def jsonPostApi[Param, Body, Response](
    prefixSegments: List[StaticRouteSegment],
    suffixSegments: List[StaticRouteSegment] = Nil,
): FixedMethodApi[PathParam[Param], Response] =
  SingleParamFixedMethodApi(Method.POST, prefixSegments, suffixSegments)

def jsonPostApi[FirstParam, SecondParam, Body, Response](
    prefixSegments: List[StaticRouteSegment],
    middleSegments: List[StaticRouteSegment],
    suffixSegments: List[StaticRouteSegment],
): FixedMethodApi[PathParams[FirstParam, SecondParam], Response] =
  DoubleParamFixedMethodApi(Method.POST, prefixSegments, middleSegments, suffixSegments)

private def requestSegments(req: Request[IO]): List[RouteSegmentText] =
  req.uri.path.renderString.split('/').filter(_.nonEmpty).toList.map(segment => new RouteSegmentText(segment))

private def staticSegmentValues(segments: List[StaticRouteSegment]): List[RouteSegmentText] =
  segments.map(_.value)

private def buildRoutePath(segments: List[RouteSegmentText]): RoutePath =
  new RoutePath(s"/${segments.map(_.raw).mkString("/")}")

private def matchesStaticApi[Response](api: StaticFixedMethodApi[Response], req: Request[IO]): Boolean =
  req.method == api.method && requestSegments(req) == staticSegmentValues(api.segments)

private def extractSingleParamApi[Param, Response](
    api: SingleParamFixedMethodApi[Param, Response],
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

private def extractDoubleParamApi[FirstParam, SecondParam, Response](
    api: DoubleParamFixedMethodApi[FirstParam, SecondParam, Response],
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

trait ApiRequestExtractor[Params <: Tuple]:
  def extract[Response](api: FixedMethodApi[Params, Response], req: Request[IO]): Option[ExtractedApiRequest[Params]]

object ApiRequestExtractor:
  given staticApiRequestExtractor: ApiRequestExtractor[NoPathParams] with
    def extract[Response](api: FixedMethodApi[NoPathParams, Response], req: Request[IO]): Option[ExtractedApiRequest[NoPathParams]] =
      api match
        case staticApi: StaticFixedMethodApi[Response] => Option.when(matchesStaticApi(staticApi, req))(req)

  given singleParamApiRequestExtractor[Param](using codec: PathParamCodec[Param]): ApiRequestExtractor[PathParam[Param]] with
    def extract[Response](api: FixedMethodApi[PathParam[Param], Response], req: Request[IO]): Option[ExtractedApiRequest[PathParam[Param]]] =
      api match
        case singleParamApi: SingleParamFixedMethodApi[Param, Response] => extractSingleParamApi(singleParamApi, req)

  given doubleParamApiRequestExtractor[FirstParam, SecondParam](using
      firstCodec: PathParamCodec[FirstParam],
      secondCodec: PathParamCodec[SecondParam],
  ): ApiRequestExtractor[PathParams[FirstParam, SecondParam]] with
    def extract[Response](
        api: FixedMethodApi[PathParams[FirstParam, SecondParam], Response],
        req: Request[IO],
    ): Option[ExtractedApiRequest[PathParams[FirstParam, SecondParam]]] =
      api match
        case doubleParamApi: DoubleParamFixedMethodApi[FirstParam, SecondParam, Response] => extractDoubleParamApi(doubleParamApi, req)

def extractApi[Params <: Tuple, Response](
    api: FixedMethodApi[Params, Response],
    req: Request[IO],
)(using extractor: ApiRequestExtractor[Params]): Option[ExtractedApiRequest[Params]] =
  extractor.extract(api, req)

def matchesApi[Params <: Tuple, Response](
    api: FixedMethodApi[Params, Response],
    req: Request[IO],
)(using extractor: ApiRequestExtractor[Params]): Boolean =
  extractApi(api, req).nonEmpty

def requireApi[Params <: Tuple, Response](
    api: FixedMethodApi[Params, Response],
    req: Request[IO],
)(using extractor: ApiRequestExtractor[Params]): ExtractedApiRequest[Params] =
  extractApi(api, req).get

def apiRoute[Params <: Tuple, ApiResponse](
    api: FixedMethodApi[Params, ApiResponse]
)(
    handle: ExtractedApiRequest[Params] => IO[Response[IO]]
)(using extractor: ApiRequestExtractor[Params]): HttpRoutes[IO] =
  HttpRoutes[IO] { req =>
    OptionT
      .fromOption[IO](extractor.extract(api, req))
      .semiflatMap(handle)
  }

def apiRouteWhere[Params <: Tuple, ApiResponse](
    api: FixedMethodApi[Params, ApiResponse]
)(
    accept: ExtractedApiRequest[Params] => Boolean
)(
    handle: ExtractedApiRequest[Params] => IO[Response[IO]]
)(using extractor: ApiRequestExtractor[Params]): HttpRoutes[IO] =
  HttpRoutes[IO] { req =>
    OptionT
      .fromOption[IO](extractor.extract(api, req).filter(accept))
      .semiflatMap(handle)
  }

private def staticApiPath[Response](api: StaticFixedMethodApi[Response]): RoutePath =
  buildRoutePath(staticSegmentValues(api.segments))

private def singleParamApiPath[Param, Response](
    api: SingleParamFixedMethodApi[Param, Response],
    param: Param,
)(using codec: PathParamCodec[Param]): RoutePath =
  buildRoutePath(
    staticSegmentValues(api.prefixSegments) ++
      List(codec.render(param)) ++
      staticSegmentValues(api.suffixSegments)
  )

private def doubleParamApiPath[FirstParam, SecondParam, Response](
    api: DoubleParamFixedMethodApi[FirstParam, SecondParam, Response],
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

def apiPath[Response](api: FixedMethodApi[NoPathParams, Response]): RoutePath =
  api match
    case staticApi: StaticFixedMethodApi[Response] => staticApiPath(staticApi)

def apiPath[Param, Response](
    api: FixedMethodApi[PathParam[Param], Response],
    param: Param,
)(using codec: PathParamCodec[Param]): RoutePath =
  api match
    case singleParamApi: SingleParamFixedMethodApi[Param, Response] => singleParamApiPath(singleParamApi, param)

def apiPath[FirstParam, SecondParam, Response](
    api: FixedMethodApi[PathParams[FirstParam, SecondParam], Response],
    first: FirstParam,
    second: SecondParam,
)(using firstCodec: PathParamCodec[FirstParam], secondCodec: PathParamCodec[SecondParam]): RoutePath =
  api match
    case doubleParamApi: DoubleParamFixedMethodApi[FirstParam, SecondParam, Response] => doubleParamApiPath(doubleParamApi, first, second)
