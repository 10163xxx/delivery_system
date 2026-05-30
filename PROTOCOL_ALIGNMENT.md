# Protocol Alignment

这个项目要求“前后端对齐”，但对齐的对象只限于协议层，不包括后端内部实现对象或前端页面装配对象。

## 协议层

以下目录中的对象和 API 视为必须前后镜像：

- 后端对象：`backend/src/main/scala/<module>/object/**`
- 前端对象：`frontend/src/object/<module>/**`
- 后端 API：`backend/src/main/scala/<module>/api/**`
- 前端 API：`frontend/src/api/<module>/**`

当前纳入协议层的业务模块：

- `admin`
- `auth`
- `customer`
- `merchant`
- `order`
- `review`
- `rider`

协议层要求：

- 后端协议对象必须在前端有同名类型文件
- 前端协议对象必须在后端有同名对象文件
- 后端业务 API 必须在前端有同名 API wrapper
- 前端业务 API 必须在后端有同名 API 定义
- 前端响应解码必须覆盖后端会返回给前端的业务对象

## 内部层

以下内容不要求前后端镜像：

- 后端持久化、运行时、校验、构造器、类型支持对象
- 后端服务层上下文、中间计算对象
- 健康检查、planner、静态资源类辅助路由
- 前端页面 props、工作台状态、草稿对象、组件私有对象

当前约定：

- 只要对象文件放在 `.../object/...` 下，就默认要求前后端补齐同名对象
- 如果只是内部中间态，又不想前后端补齐，就不要把它做成独立 `object` 文件

## 检查方式

运行：

```bash
python3 scripts/check_protocol_alignment.py
```

脚本只检查协议层白名单目录，并忽略本文档列出的例外项。
