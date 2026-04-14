# Project Setup

这个仓库包含两个独立部分：

- `frontend`: `Vite + React + TypeScript`
- `backend`: `Scala 3 + sbt + http4s`

当前配送业务只支持真实 Scala 后端，不再提供独立的 mock 后端脚本。

## 一键初始化

在仓库根目录执行：

```bash
./scripts/setup-dev.sh
```

这个脚本会：

- 调用 `frontend/scripts/setup-frontend.sh` 安装前端依赖
- 保留 `backend/scripts/setup-postgres.sh` 作为可选数据库示例脚本

如果你只想做其中一部分：

```bash
SETUP_DATABASE=0 ./scripts/setup-dev.sh
SETUP_FRONTEND=0 ./scripts/setup-dev.sh
```

## 启动项目

前端：

```bash
cd frontend
npm run dev
```

后端：

```bash
cd backend
./sbtw run
```

当前业务后端默认把认证状态和配送业务状态持久化到：

- `backend/data/auth-state.json`
- `backend/data/delivery-state.json`

默认端口：

- 前端开发服务器：Vite 默认端口
- 后端：`http://127.0.0.1:8081`

## 可选环境变量

前端：

- `NPM_REGISTRY`

后端持久化文件：

- `AUTH_STATE_FILE`
- `DELIVERY_STATE_FILE`

后端数据库示例配置（仅模板保留，当前配送业务默认不依赖 PostgreSQL）：

- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `DB_MAX_POOL_SIZE`
- `DB_CONNECTION_TIMEOUT_MS`

后端 sbt 缓存或 launcher 覆盖：

- `SBT_LAUNCH_JAR`
- `SBT_CACHE_DIR`
- `COURSIER_CACHE`
- `SBT_BOOT_DIR`
- `SBT_GLOBAL_BASE`
- `SBT_IVY_HOME`

## 代码约束

- 前后端都优先使用短小、单一职责的函数；函数过长时先拆辅助函数，再继续叠逻辑。
- 前后端业务逻辑优先写成 pure function：相同输入得到相同输出，不直接读写外部状态；`IO`、网络、磁盘、数据库、时间、随机数、浏览器存储、定时器等副作用统一压到路由、存储、服务边界或显式 effect 包装层。
- 避免 OOP 式组织，尤其避免把行为塞进对象后再用 `obj.fn()` 分发业务流程；业务代码里不要设计“对象调用函数”的模式，优先把函数平铺成独立参数或普通函数调用。
- 优先使用显式数据传递和普通函数组合；状态装配可以集中，但不要把业务逻辑藏进“service”对象。
- 前后端代码默认使用强类型表达业务约束；禁止引入 `any`、`as any`、无约束裸对象载荷或用字符串硬编码代替领域类型，必要时优先补充类型定义再写逻辑。
- 后端同样必须保持强类型；禁止把业务参数、错误上下文或显示值回退到 `Any`、弱类型 JSON 中转或字符串拼接兜底，优先补充领域类型、枚举和类型类。
- 对外部输入、异常和反序列化结果，允许先用 `unknown` 接收，但必须在进入业务逻辑前完成显式收窄、校验或转换。
- 业务枚举值、角色名、状态名、路由段、存储键和默认行为不得在业务代码里裸写；统一收敛到领域常量、共享配置或类型安全的构造函数后再引用。
- 对象定义必须按职责集中收口：领域对象、请求/响应对象、枚举和共享类型统一放 `domain`；页面草稿、表单对象、工作台视图和界面编排对象统一放 `app`；组件目录只允许保留组件私有对象，不能继续散落公共业务对象。
- 前端 `delivery` 目录只保留纯业务规则、校验、格式化、payload 构造和共享常量；带副作用的动作编排、页面流程装配和状态联动统一放 `app`；公共展示 copy 与视图元数据统一放 `components` 或具体 UI 目录，不再放回业务规则层。
- 前后端目录按业务模块保持镜像对齐；例如一侧新增 `auth`、`customer`、`merchant`、`order`、`review`、`admin`、`rider` 等模块时，另一侧也要在对应层级补齐同名目录或明确说明为何例外。
- 提交前检查前后端分层目录是否一致，至少对齐 `domain`、接口层（前端 `src/api` / 后端 `src/main/scala/api`）以及业务装配层（前端 `src/app` / 后端 `src/main/scala/app`）；前端不再单列 `services` 作为并行大类，应用编排统一归 `app`。
- 当前仓库检查结果：业务模块目录已按约定补齐；前端 `src/api` 与后端 `src/main/scala/api` 已使用同一接口层大类命名，前后端业务路由职责保持对应。
- 当前仓库强类型检查结果：前端 `src` 与后端 `src` 未发现显式 `any`；前端仅在错误边界使用 `unknown`，并已在消费前做类型收窄。
- 当前仓库后端强类型检查结果：已移除后端业务层里的 `Any` 显示/错误入口，改为基于领域类型与 `DisplayTextRenderer` 的显式渲染。
- 当前仓库常量检查结果：已新增前端共享领域常量并替换主要业务裸值，优先覆盖角色、订单状态、审核状态、申诉/复核目标、提现账户类型和关键路由入口。
- 当前仓库 OOP 检查结果：前端自定义状态对象上的 `obj.fn()` 调用已清理；后端 planner 注册也已从“注册对象执行 `run`”改为普通函数映射分发。
- 当前仓库 pure function 检查结果：纯业务计算函数占比已经不低，但前后端都仍存在明确副作用边界；前端主要在 `api`、`app`、React hooks 和浏览器存储，后端主要在 `api`、`database`、`infra`、`IO.blocking`、状态持久化与时间/ID 生成。
- 当前仓库分层检查结果：前端页面装配文件已从 `services` 收回 `app/delivery`；后端 JDBC 表访问文件已并入 `database`，不再悬挂在独立 `tables` 顶层目录。
- 当前仓库 app 对齐结果：前端原 `services` 下的页面状态、视图编排与会话管理文件已统一并入 `src/app/delivery`，现在前后端都以 `app` 作为应用编排主目录。
- 当前仓库对象收口结果：前端页面草稿、表单字段、工作台视图和骑手工作台对象已统一收进 `src/app/delivery`，`src/delivery` 与组件目录不再保留公共对象定义入口。
- 当前仓库规则层检查结果：前端 `src/delivery` 已收敛为纯规则层，不再承载 `actions` 或公共 UI 配置；顾客/商家动作编排已并入 `src/app/delivery/actions`，公共展示 copy 已迁入 `src/components/delivery`。
- 当前仓库组件边界检查结果：商家控制台状态 hook 与公共面板 props 已从 `components/delivery/merchant-console` 收回 `src/app/delivery`；组件目录现在只保留渲染组件和组件私有 copy。
