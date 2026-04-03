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
