import { isRouteErrorResponse, Link, useLocation, useRouteError } from 'react-router-dom'

function getFallbackPath(pathname: string) {
  if (pathname.startsWith('/customer/')) {
    return '/customer/order'
  }

  return '/'
}

type ErrorContent = {
  status: number
  title: string
  detail: string
}

function resolveErrorContent(error: unknown): ErrorContent {
  if (isRouteErrorResponse(error)) {
    return {
      status: error.status,
      title: error.statusText || '页面暂时不可用',
      detail:
        typeof error.data === 'string' && error.data.trim().length > 0
          ? error.data
          : '当前地址没有匹配到可用页面，请返回业务工作台继续操作。',
    }
  }

  if (error instanceof Error) {
    return {
      status: 500,
      title: '页面加载失败',
      detail: error.message || '页面渲染过程中出现异常，请返回后重试。',
    }
  }

  return {
    status: 500,
    title: '页面加载失败',
    detail: '页面渲染过程中出现异常，请返回后重试。',
  }
}

function RouteStatusCard({
  pathname,
  status,
  title,
  detail,
}: {
  pathname: string
  status: number
  title: string
  detail: string
}) {
  const fallbackPath = getFallbackPath(pathname)

  return (
    <main className="route-status-shell">
      <section className="route-status-card">
        <p className="eyebrow">Route Error</p>
        <strong>{status}</strong>
        <h1>{title}</h1>
        <p>{detail}</p>
        <p className="route-status-path">当前地址：{pathname}</p>
        <div className="action-row">
          <Link className="primary-button" to={fallbackPath}>
            返回页面
          </Link>
          <Link className="secondary-button" to="/">
            回到首页
          </Link>
        </div>
      </section>
    </main>
  )
}

export function RouteErrorPage() {
  const error = useRouteError()
  const location = useLocation()
  const content = resolveErrorContent(error)

  return <RouteStatusCard pathname={location.pathname} {...content} />
}

export function NotFoundPage() {
  const location = useLocation()

  return (
    <RouteStatusCard
      pathname={location.pathname}
      status={404}
      title="页面不存在"
      detail="当前访问地址未命中前端路由，已提供返回入口。"
    />
  )
}
