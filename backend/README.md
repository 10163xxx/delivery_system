# backend-sample

一个基于 Scala 3、Cats Effect、http4s、Circe 的可运行后端。
当前配送与认证接口默认使用本地 JSON 文件持久化，不再依赖进程内 mock 状态。

## 目录结构

- `src/main/scala/Main.scala`: 主程序入口，启动 http4s 服务

按职责分成 5 组：

- `http`: 路由入口和鉴权辅助
  - 包含 `auth`、`delivery`、`health`、`planner`、`support`
- `app`: 应用服务和状态流转
  - 包含 `delivery`、`auth`、`planner`
- `domain`: 领域模型、请求/响应对象、共享类型
  - 按 `auth / customer / merchant / order / review / rider / admin / shared` 分组
- `infra`: 基础设施
  - 当前主要是 JSON 文件持久化和上传存储
- `database`、`tables`: 保留的数据库配置和 SQL 示例

运行相关目录：

- `data`: 本地 JSON 持久化文件
- `scripts`: 构建、运行和初始化脚本

可以把主链路理解成：

- `http -> app -> domain/infra`

## 运行

```bash
./sbtw run
```

默认监听：

- `http://0.0.0.0:8081`

默认持久化文件：

- `data/auth-state.json`
- `data/delivery-state.json`

可通过环境变量覆盖：

- `AUTH_STATE_FILE`
- `DELIVERY_STATE_FILE`

仓库里仍然保留了 PostgreSQL/JDBC 示例代码，便于后续切换成数据库表模型，但当前主链路默认不要求 PostgreSQL 才能运行。

## 持久化说明

后端每次修改认证或配送状态后都会立即写盘，因此服务重启后仍能保留：

- 已注册账号
- 登录会话
- 顾客 / 骑手资料
- 商家申请、店铺、菜单、订单等业务数据

## API 示例

### 健康检查

```bash
curl http://127.0.0.1:8081/api/health
```

### EchoPlanner

```bash
curl -X POST http://127.0.0.1:8081/api/EchoPlanner \
  -H 'Content-Type: application/json' \
  -d '{"message":"hello world","uppercase":true}'
```

### 注册并读取配送状态

```bash
curl -X POST http://127.0.0.1:8081/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"username":"demo_user","password":"demo123","role":"customer","displayName":"演示用户"}'
```

拿到返回里的 `token` 后可继续读取前端主状态接口：

```bash
curl http://127.0.0.1:8081/api/delivery/state \
  -H 'x-session-token: <token>'
```

## 日志

服务启动后可以在控制台看到：

- 服务启动日志
- 每个 API 的访问日志
- http4s 中间件输出的请求日志和响应日志

## 代码约束

- 保持函数简短，单个函数只做一层决策或一层状态变换。
- 避免 OOP 式写法，不把业务流程挂在对象实例上做 `obj.fn()` 调度。
- 后端主链路优先使用顶层函数和小型辅助函数组合；先拆查找、校验、构造、状态更新，再拼接流程。
