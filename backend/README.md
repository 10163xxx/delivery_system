# backend-sample

一个基于 Scala 3、Cats Effect、http4s、Circe 的可运行后端。
当前配送与认证接口默认使用本地 JSON 文件持久化，不再依赖进程内 mock 状态。

## 目录结构

- `src/main/scala/Main.scala`: 主程序，启动 http4s 服务
- `src/main/scala/routes`: 路由定义与总路由分发
- `src/main/scala/api`: `plan` 定义与具体业务实现
- `src/main/scala/database`: 保留的数据库连接示例
- `src/main/scala/tables`: 每张表一个文件，集中维护建表 SQL、常见 SQL 和表操作
- `src/main/scala/objects`: 请求/响应类型定义
- `src/main/scala/state`: 业务状态仓储与 JSON 持久化

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

仓库里仍然保留了 PostgreSQL/JDBC 示例代码，便于后续切换成数据库表模型，但当前配送业务接口默认不要求 PostgreSQL 才能运行。

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
