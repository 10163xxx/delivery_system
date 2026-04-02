import http from 'node:http'
import { randomUUID } from 'node:crypto'

const PORT = Number(process.env.APP_PORT ?? 8081)

const now = () => new Date().toISOString()

const state = {
  customers: [
    {
      id: 'cust-1',
      name: '林悦',
      phone: '13800000001',
      defaultAddress: '浦东新区世纪大道 88 号',
      addresses: [
        { label: '家', address: '浦东新区世纪大道 88 号' },
        { label: '公司', address: '浦东新区张杨路 188 号' },
      ],
      accountStatus: 'Active',
      revokedReviewCount: 0,
      membershipTier: 'Standard',
      monthlySpendCents: 0,
      balanceCents: 10000,
      coupons: [],
    },
    {
      id: 'cust-2',
      name: '周行',
      phone: '13800000002',
      defaultAddress: '静安区南京西路 318 号',
      addresses: [{ label: '家', address: '静安区南京西路 318 号' }],
      accountStatus: 'Active',
      revokedReviewCount: 0,
      membershipTier: 'Standard',
      monthlySpendCents: 0,
      balanceCents: 5000,
      coupons: [],
    },
  ],
  stores: [],
  riders: [
    {
      id: 'rider-1',
      name: '陈凯',
      vehicle: '电动车',
      zone: '浦东',
      availability: 'Available',
      averageRating: 0,
      ratingCount: 0,
      oneStarRatingCount: 0,
    },
    {
      id: 'rider-2',
      name: '赵晨',
      vehicle: '摩托车',
      zone: '静安',
      availability: 'Available',
      averageRating: 0,
      ratingCount: 0,
      oneStarRatingCount: 0,
    },
  ],
  admins: [{ id: 'admin-1', name: '总控台管理员' }],
  merchantApplications: [],
  reviewAppeals: [],
  eligibilityReviews: [],
  orders: [],
  tickets: [],
  metrics: {
    totalOrders: 0,
    activeOrders: 0,
    resolvedTickets: 0,
    averageRating: 0,
  },
}

const accounts = [
  {
    id: 'usr-admin-1',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    displayName: '总控台管理员',
    linkedProfileId: 'admin-1',
  },
  {
    id: 'usr-cust-1',
    username: 'cust_1',
    password: 'cust123',
    role: 'customer',
    displayName: '林悦',
    linkedProfileId: 'cust-1',
  },
  {
    id: 'usr-cust-2',
    username: 'cust_2',
    password: 'cust123',
    role: 'customer',
    displayName: '周行',
    linkedProfileId: 'cust-2',
  },
  {
    id: 'usr-rider-1',
    username: 'rider_1',
    password: 'rider123',
    role: 'rider',
    displayName: '陈凯',
    linkedProfileId: 'rider-1',
  },
  {
    id: 'usr-rider-2',
    username: 'rider_2',
    password: 'rider123',
    role: 'rider',
    displayName: '赵晨',
    linkedProfileId: 'rider-2',
  },
  {
    id: 'usr-merchant-1',
    username: 'merchant_wang',
    password: 'merchant123',
    role: 'merchant',
    displayName: '王师傅',
    linkedProfileId: null,
  },
  {
    id: 'usr-merchant-2',
    username: 'merchant_su',
    password: 'merchant123',
    role: 'merchant',
    displayName: '苏宁',
    linkedProfileId: null,
  },
]

const sessions = new Map()

function json(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(payload))
}

function text(res, statusCode, message) {
  res.writeHead(statusCode, { 'Content-Type': 'text/plain; charset=utf-8' })
  res.end(message)
}

function getSessionUser(req) {
  const token = req.headers['x-session-token']
  if (!token || Array.isArray(token)) return null
  const accountId = sessions.get(token)
  if (!accountId) return null
  return accounts.find((entry) => entry.id === accountId) ?? null
}

function toSessionResponse(account, token) {
  return {
    token,
    user: {
      id: account.id,
      username: account.username,
      role: account.role,
      displayName: account.displayName,
      linkedProfileId: account.linkedProfileId,
    },
  }
}

function createApprovedStore(application) {
  const storeId = `store-${application.id.slice(-4)}`
  return {
    id: storeId,
    merchantName: application.merchantName,
    name: application.storeName,
    category: application.category,
    cuisine: application.category,
    status: 'Open',
    avgPrepMinutes: application.avgPrepMinutes,
    imageUrl: application.imageUrl ?? null,
    menu: [],
    averageRating: 0,
    ratingCount: 0,
    oneStarRatingCount: 0,
    revenueCents: 0,
  }
}

function roundCurrency(value) {
  return Math.round(value)
}

async function readBody(req) {
  const chunks = []
  for await (const chunk of req) {
    chunks.push(chunk)
  }
  const raw = Buffer.concat(chunks).toString('utf8')
  return raw ? JSON.parse(raw) : {}
}

async function readRawBody(req) {
  const chunks = []
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }
  return Buffer.concat(chunks)
}

function extractMultipartImage(bodyBuffer, contentType) {
  const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i)
  const boundary = boundaryMatch?.[1] ?? boundaryMatch?.[2]
  if (!boundary) {
    throw new Error('上传请求缺少 multipart boundary')
  }

  const marker = Buffer.from(`--${boundary}`)
  const headerSeparator = Buffer.from('\r\n\r\n')
  let cursor = 0

  while (cursor < bodyBuffer.length) {
    const partStart = bodyBuffer.indexOf(marker, cursor)
    if (partStart === -1) break

    const afterMarker = partStart + marker.length
    const isTerminal = bodyBuffer.slice(afterMarker, afterMarker + 2).equals(Buffer.from('--'))
    if (isTerminal) break

    const contentStart = afterMarker + 2
    const headerEnd = bodyBuffer.indexOf(headerSeparator, contentStart)
    if (headerEnd === -1) break

    const headerText = bodyBuffer.slice(contentStart, headerEnd).toString('utf8')
    const dispositionMatch = headerText.match(/name="([^"]+)"/i)
    const mimeMatch = headerText.match(/content-type:\s*([^\r\n;]+)/i)
    const nextBoundary = bodyBuffer.indexOf(marker, headerEnd + headerSeparator.length)
    if (nextBoundary === -1) break

    const dataEnd = nextBoundary - 2
    const data = bodyBuffer.slice(headerEnd + headerSeparator.length, dataEnd)
    cursor = nextBoundary

    if (dispositionMatch?.[1] !== 'file') continue

    const mimeType = mimeMatch?.[1]?.trim() || 'application/octet-stream'
    return {
      mimeType,
      buffer: data,
    }
  }

  throw new Error('未找到上传图片文件')
}

const server = http.createServer(async (req, res) => {
  try {
    if (!req.url || !req.method) {
      text(res, 404, 'Not Found')
      return
    }

    const url = new URL(req.url, `http://${req.headers.host ?? '127.0.0.1'}`)

    if (req.method === 'POST' && url.pathname === '/api/auth/login') {
      const body = await readBody(req)
      const account = accounts.find(
        (entry) => entry.username === body.username && entry.password === body.password,
      )
      if (!account) {
        text(res, 400, '账号不存在或密码错误')
        return
      }
      const token = randomUUID().replaceAll('-', '')
      sessions.set(token, account.id)
      json(res, 200, toSessionResponse(account, token))
      return
    }

    if (req.method === 'GET' && url.pathname === '/api/auth/session') {
      const token = req.headers['x-session-token']
      if (!token || Array.isArray(token)) {
        text(res, 401, '未登录')
        return
      }
      const accountId = sessions.get(token)
      const account = accounts.find((entry) => entry.id === accountId)
      if (!account) {
        text(res, 401, '未登录')
        return
      }
      json(res, 200, toSessionResponse(account, token))
      return
    }

    if (req.method === 'POST' && url.pathname === '/api/auth/logout') {
      const token = req.headers['x-session-token']
      if (token && !Array.isArray(token)) {
        sessions.delete(token)
      }
      res.writeHead(204)
      res.end()
      return
    }

    if (req.method === 'GET' && url.pathname === '/api/delivery/state') {
      const account = getSessionUser(req)
      if (!account) {
        text(res, 401, '未登录')
        return
      }
      json(res, 200, state)
      return
    }

    if (req.method === 'POST' && /^\/api\/delivery\/customers\/[^/]+\/profile$/.test(url.pathname)) {
      const account = getSessionUser(req)
      if (!account || account.role !== 'customer') {
        text(res, 403, '当前账号无权限修改顾客资料')
        return
      }

      const customerId = url.pathname.split('/')[4]
      if (account.linkedProfileId !== customerId) {
        text(res, 403, '无权修改其他顾客资料')
        return
      }

      const customer = state.customers.find((entry) => entry.id === customerId)
      if (!customer) {
        text(res, 404, '顾客不存在')
        return
      }

      const body = await readBody(req)
      const name = String(body.name ?? '').trim()
      if (!name) {
        text(res, 400, '用户名不能为空')
        return
      }

      customer.name = name
      account.displayName = name
      json(res, 200, state)
      return
    }

    if (req.method === 'POST' && /^\/api\/delivery\/customers\/[^/]+\/addresses$/.test(url.pathname)) {
      const account = getSessionUser(req)
      if (!account || account.role !== 'customer') {
        text(res, 403, '当前账号无权限新增地址')
        return
      }

      const customerId = url.pathname.split('/')[4]
      if (account.linkedProfileId !== customerId) {
        text(res, 403, '无权修改其他顾客地址')
        return
      }

      const customer = state.customers.find((entry) => entry.id === customerId)
      if (!customer) {
        text(res, 404, '顾客不存在')
        return
      }

      const body = await readBody(req)
      const label = String(body.label ?? '').trim()
      const address = String(body.address ?? '').trim()
      if (!label || !address) {
        text(res, 400, '请完整填写地址标签和地址内容')
        return
      }

      customer.addresses.unshift({ label, address })
      if (!customer.defaultAddress) {
        customer.defaultAddress = address
      }
      json(res, 200, state)
      return
    }

    if (req.method === 'POST' && /^\/api\/delivery\/customers\/[^/]+\/recharge$/.test(url.pathname)) {
      const account = getSessionUser(req)
      if (!account || account.role !== 'customer') {
        text(res, 403, '当前账号无权限充值')
        return
      }

      const customerId = url.pathname.split('/')[4]
      if (account.linkedProfileId !== customerId) {
        text(res, 403, '无权给其他顾客充值')
        return
      }

      const customer = state.customers.find((entry) => entry.id === customerId)
      if (!customer) {
        text(res, 404, '顾客不存在')
        return
      }

      const body = await readBody(req)
      const amountCents = Number(body.amountCents ?? 0)
      if (!Number.isFinite(amountCents) || amountCents <= 0) {
        text(res, 400, '请输入有效充值金额')
        return
      }
      if (amountCents > 500000) {
        text(res, 400, '单次充值金额不能超过 5000 元')
        return
      }

      customer.balanceCents += roundCurrency(amountCents)
      json(res, 200, state)
      return
    }

    if (req.method === 'POST' && url.pathname === '/api/delivery/uploads/store-image') {
      const account = getSessionUser(req)
      if (!account || (account.role !== 'merchant' && account.role !== 'admin')) {
        text(res, 403, '当前账号无权限上传图片')
        return
      }

      const contentType = req.headers['content-type']
      if (!contentType || Array.isArray(contentType) || !contentType.includes('multipart/form-data')) {
        text(res, 400, '上传必须使用 multipart/form-data')
        return
      }

      const rawBody = await readRawBody(req)
      const file = extractMultipartImage(rawBody, contentType)
      const imageDataUrl = `data:${file.mimeType};base64,${file.buffer.toString('base64')}`

      json(res, 200, { url: imageDataUrl })
      return
    }

    if (req.method === 'POST' && url.pathname === '/api/delivery/merchant-applications') {
      const account = getSessionUser(req)
      if (!account || account.role !== 'merchant') {
        text(res, 403, '当前账号无权限提交入驻申请')
        return
      }
      const body = await readBody(req)
      const application = {
        id: `app-${randomUUID().slice(0, 8)}`,
        merchantName: body.merchantName,
        storeName: body.storeName,
        category: body.category,
        avgPrepMinutes: Number(body.avgPrepMinutes ?? 20),
        imageUrl: body.imageUrl ?? null,
        note: body.note ?? null,
        status: 'Pending',
        reviewNote: null,
        submittedAt: now(),
        reviewedAt: null,
      }
      state.merchantApplications.unshift(application)
      json(res, 200, state)
      return
    }

    if (
      req.method === 'POST' &&
      /^\/api\/delivery\/merchant-applications\/[^/]+\/approve$/.test(url.pathname)
    ) {
      const account = getSessionUser(req)
      if (!account || account.role !== 'admin') {
        text(res, 403, '当前账号无权限审核入驻申请')
        return
      }
      const applicationId = url.pathname.split('/')[4]
      const body = await readBody(req)
      const application = state.merchantApplications.find((entry) => entry.id === applicationId)
      if (!application) {
        text(res, 404, '入驻申请不存在')
        return
      }
      application.status = 'Approved'
      application.reviewNote = body.reviewNote ?? '资料已核验'
      application.reviewedAt = now()
      state.stores.unshift(createApprovedStore(application))
      json(res, 200, state)
      return
    }

    if (
      req.method === 'POST' &&
      /^\/api\/delivery\/merchant-applications\/[^/]+\/reject$/.test(url.pathname)
    ) {
      const account = getSessionUser(req)
      if (!account || account.role !== 'admin') {
        text(res, 403, '当前账号无权限审核入驻申请')
        return
      }
      const applicationId = url.pathname.split('/')[4]
      const body = await readBody(req)
      const application = state.merchantApplications.find((entry) => entry.id === applicationId)
      if (!application) {
        text(res, 404, '入驻申请不存在')
        return
      }
      application.status = 'Rejected'
      application.reviewNote = body.reviewNote ?? '资料不完整'
      application.reviewedAt = now()
      json(res, 200, state)
      return
    }

    if (req.method === 'POST' && /^\/api\/delivery\/stores\/[^/]+\/menu$/.test(url.pathname)) {
      const account = getSessionUser(req)
      if (!account || (account.role !== 'merchant' && account.role !== 'admin')) {
        text(res, 403, '当前账号无权限新增菜品')
        return
      }

      const storeId = url.pathname.split('/')[4]
      const store = state.stores.find((entry) => entry.id === storeId)
      if (!store) {
        text(res, 404, '门店不存在')
        return
      }
      if (account.role === 'merchant' && store.merchantName !== account.displayName) {
        text(res, 403, '无权编辑其他商家的菜单')
        return
      }

      const body = await readBody(req)
      const name = String(body.name ?? '').trim()
      const description = String(body.description ?? '').trim()
      const priceCents = Number(body.priceCents ?? 0)
      const imageUrl = typeof body.imageUrl === 'string' && body.imageUrl.trim() ? body.imageUrl.trim() : null

      if (!name) {
        text(res, 400, '菜品名称不能为空')
        return
      }
      if (!description) {
        text(res, 400, '菜品描述不能为空')
        return
      }
      if (!Number.isFinite(priceCents) || priceCents <= 0) {
        text(res, 400, '菜品价格必须大于 0')
        return
      }

      store.menu.unshift({
        id: `menu-${randomUUID().slice(0, 8)}`,
        name,
        description,
        priceCents: Math.round(priceCents),
        imageUrl,
      })

      json(res, 200, state)
      return
    }

    if (req.method === 'POST' && url.pathname === '/api/delivery/orders/clear') {
      state.orders = []
      state.tickets = []
      state.metrics.totalOrders = 0
      state.metrics.activeOrders = 0
      state.metrics.resolvedTickets = 0
      json(res, 200, state)
      return
    }

    text(res, 404, `No route for ${req.method} ${url.pathname}`)
  } catch (error) {
    text(res, 500, error instanceof Error ? error.message : 'Internal Server Error')
  }
})

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Mock delivery server listening on http://127.0.0.1:${PORT}`)
})
