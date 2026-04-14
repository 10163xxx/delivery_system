# Frontend Template

这是当前配送业务前端，技术栈是 `Vite + React + TypeScript`。

项目不是通用 mock 模板，而是一套已经按业务拆分过的配送控制台前端。当前代码主要围绕顾客、商家、骑手、管理员四类角色展开，入口页统一落在配送控制台。

当前项目已经补齐这些基础设施：

- `npm` 作为默认包管理器，并固定 `packageManager: npm@10.9.2`
- `@/*` 路径别名
- `components.json` 与基础 UI 组件配置
- Vite + TypeScript 工程配置
- 按业务拆分的 `app / services / features / components / api / domain` 目录结构

## 开发命令

```bash
./scripts/setup-frontend.sh
npm run dev
```

如果你的 npm registry 在当前网络环境下不稳定，可以通过环境变量覆盖 registry：

```bash
NPM_REGISTRY=https://registry.npmmirror.com ./scripts/setup-frontend.sh
```

常用脚本：

```bash
npm run typecheck
npm run lint
npm run lint:fix
npm run build
npm run preview
```

## 关键文件

- `src/shared/app/main.tsx`: 应用挂载入口
- `src/shared/app/router.tsx`: 路由入口，当前主要把不同 URL 映射到统一的配送控制台页面
- `src/pages`: 页面入口，目前核心页是 `DeliveryConsole.tsx`
- `src/app/delivery`: 页面组装层
- `src/services`: 页面状态、派生视图和会话管理
- `src/delivery`: 配送业务规则与表单逻辑
- `src/components/delivery`: 角色视图和展示组件
- `src/api`: 接口调用层
- `src/domain`: 领域模型和共享类型
- `src/styles`: 样式文件
- `public`: 静态资源

## 目录分层

按职责分成 4 组：

- 页面层：`pages`、`app`、`components`
  - 负责路由落点、页面组装和角色界面展示
- 状态与业务层：`services`、`features`
  - `services` 管页面状态和派生视图，`features` 放业务规则、校验、常量、payload
- 数据层：`api`、`domain`
  - `api` 负责请求后端，`domain` 负责类型和对象模型
- 资源层：`styles`、`public`
  - 样式和静态资源集中放这里

可以把主链路理解成：

- `pages/app -> services/features -> api/domain -> backend`

## 当前接口约定

前端统一通过 `src/api/http.ts` 请求后端，默认目标是：

- `http://127.0.0.1:8081`

会话 token 存在浏览器本地存储里，请求时通过 `x-session-token` 发送。
