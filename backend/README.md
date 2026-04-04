# Blog Backend

这是一个基于 Express.js 和 Prisma 的博客后端系统，提供文章管理、应用管理和用户认证功能。

## 技术栈

- **Express.js**: Web 框架
- **Prisma**: ORM 和数据库管理
- **SQLite**: 开发环境数据库
- **TypeScript**: 类型安全
- **JWT**: 身份认证
- **bcrypt**: 密码加密

## 安装

### 前置要求

- Node.js (版本 18 或更高)
- npm 或 yarn

### 安装步骤

1. 克隆仓库并进入后端目录：

```bash
cd backend
```

2. 安装依赖：

```bash
npm install
```

3. 配置环境变量：

```bash
cp .env.example .env
```

编辑 `.env` 文件，根据需要修改配置项。

4. 初始化数据库：

```bash
npx prisma migrate dev
```

5. 启动开发服务器：

```bash
npm run dev
```

## 配置

### 环境变量

在 `.env` 文件中配置以下环境变量：

| 变量名 | 说明 | 默认值 | 必填 |
|--------|------|--------|------|
| `PORT` | 后端服务端口 | 3001 | 否 |
| `ADMIN_USERNAME` | 管理员用户名 | admin | 否 |
| `ADMIN_PASSWORD` | 管理员密码 | newsun2024 | 否 |
| `JWT_SECRET` | JWT 签名密钥 | your-secret-key | 是 |
| `LOG_LEVEL` | 日志级别 (DEBUG/INFO/WARN/ERROR) | INFO | 否 |

**重要提示**：在生产环境中，请务必修改 `JWT_SECRET` 为一个强密码！

### 日志级别

- `DEBUG`: 输出详细调试信息
- `INFO`: 输出一般信息（默认）
- `WARN`: 只输出警告和错误
- `ERROR`: 只输出错误

## 运行

### 开发模式

使用 nodemon 自动重启：

```bash
npm run dev
```

### 生产构建

```bash
npm run build
npm start
```

### 健康检查

启动服务后，可以访问健康检查端点：

```
http://localhost:3001/api/health
```

## API 接口文档

### 认证相关

#### 登录

**POST** `/api/auth/login`

请求体：
```json
{
  "username": "admin",
  "password": "newsun2024"
}
```

响应（成功）：
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "uuid",
    "username": "admin"
  }
}
```

### 文章管理

#### 获取所有文章

**GET** `/api/articles`

响应：
```json
[
  {
    "id": "uuid",
    "title": "文章标题",
    "content": "文章内容",
    "date": "2024-01-01",
    "summary": "文章摘要",
    "imageUrl": "https://example.com/image.jpg",
    "tags": ["tag1", "tag2"],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### 获取单篇文章

**GET** `/api/articles/:id`

响应：
```json
{
  "id": "uuid",
  "title": "文章标题",
  "content": "文章内容",
  "date": "2024-01-01",
  "summary": "文章摘要",
  "imageUrl": "https://example.com/image.jpg",
  "tags": ["tag1", "tag2"],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### 创建文章（需要认证）

**POST** `/api/articles`

请求头：
```
Authorization: Bearer <token>
```

请求体：
```json
{
  "title": "文章标题",
  "content": "文章内容",
  "date": "2024-01-01",
  "summary": "文章摘要",
  "imageUrl": "https://example.com/image.jpg",
  "tags": ["tag1", "tag2"]
}
```

#### 更新文章（需要认证）

**PUT** `/api/articles/:id`

请求头：
```
Authorization: Bearer <token>
```

请求体：
```json
{
  "title": "更新后的标题",
  "content": "更新后的内容"
}
```

#### 删除文章（需要认证）

**DELETE** `/api/articles/:id`

请求头：
```
Authorization: Bearer <token>
```

### 应用管理

#### 获取所有应用

**GET** `/api/apps`

响应：
```json
[
  {
    "id": "uuid",
    "title": "应用名称",
    "description": "应用描述",
    "url": "https://example.com",
    "category": "工具",
    "tags": ["tag1", "tag2"],
    "iconName": "icon-name",
    "imageUrl": "https://example.com/image.jpg",
    "isPrivate": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### 获取单个应用

**GET** `/api/apps/:id`

响应：
```json
{
  "id": "uuid",
  "title": "应用名称",
  "description": "应用描述",
  "url": "https://example.com",
  "category": "工具",
  "tags": ["tag1", "tag2"],
  "iconName": "icon-name",
  "imageUrl": "https://example.com/image.jpg",
  "isPrivate": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### 创建应用（需要认证）

**POST** `/api/apps`

请求头：
```
Authorization: Bearer <token>
```

请求体：
```json
{
  "title": "应用名称",
  "description": "应用描述",
  "url": "https://example.com",
  "category": "工具",
  "tags": ["tag1", "tag2"],
  "iconName": "icon-name",
  "imageUrl": "https://example.com/image.jpg",
  "isPrivate": false
}
```

#### 更新应用（需要认证）

**PUT** `/api/apps/:id`

请求头：
```
Authorization: Bearer <token>
```

请求体：
```json
{
  "title": "更新后的应用名称",
  "description": "更新后的描述"
}
```

#### 删除应用（需要认证）

**DELETE** `/api/apps/:id`

请求头：
```
Authorization: Bearer <token>
```

## 与前端配合使用

### 前端配置

1. 在前端项目的环境变量中配置后端 API 地址：

```env
VITE_API_URL=http://localhost:3001/api
```

2. 前端 API 调用示例：

```typescript
const API_BASE = import.meta.env.VITE_API_URL;

// 获取文章列表
async function getArticles() {
  const response = await fetch(`${API_BASE}/articles`);
  return response.json();
}

// 登录
async function login(username: string, password: string) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return response.json();
}

// 创建文章（需要认证）
async function createArticle(article: any, token: string) {
  const response = await fetch(`${API_BASE}/articles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(article),
  });
  return response.json();
}
```

### 开发时同时运行前端和后端

1. 启动后端（在 backend 目录）：

```bash
cd backend
npm run dev
```

2. 启动前端（在根目录）：

```bash
npm run dev
```

前端会运行在默认端口（通常是 5173），后端运行在 3001 端口。

### 认证流程

1. 用户使用管理员账号密码登录
2. 后端返回 JWT token
3. 前端将 token 存储在 localStorage 或 sessionStorage 中
4. 后续需要认证的请求在请求头中携带 `Authorization: Bearer <token>`
5. token 有效期为 24 小时

## 数据库

### Prisma Schema

数据库模型定义在 `prisma/schema.prisma` 中，包含以下模型：

- `AdminUser`: 管理员用户
- `Article`: 文章
- `AppItem`: 应用项

### 数据库迁移

创建新的迁移：

```bash
npx prisma migrate dev --name migration-name
```

查看数据库：

```bash
npx prisma studio
```

## 项目结构

```
backend/
├── prisma/
│   ├── schema.prisma          # 数据库模型定义
│   └── migrations/            # 数据库迁移文件
├── src/
│   ├── middleware/
│   │   ├── auth.ts           # JWT 认证中间件
│   │   └── errorHandler.ts   # 错误处理中间件
│   ├── routes/
│   │   ├── auth.ts           # 认证路由
│   │   ├── articles.ts       # 文章路由
│   │   └── apps.ts           # 应用路由
│   ├── utils/
│   │   └── logger.ts         # 日志工具
│   ├── index.ts              # 入口文件
│   ├── initAdmin.ts          # 初始化管理员用户
│   └── prisma.ts             # Prisma 客户端
├── .env                       # 环境变量
├── .env.example              # 环境变量示例
├── package.json
└── tsconfig.json
```

## 开发建议

1. **日志调试**: 在开发环境中，可以将 `LOG_LEVEL` 设置为 `DEBUG` 以查看更详细的日志信息
2. **数据库管理**: 使用 `npx prisma studio` 可以方便地查看和编辑数据库
3. **代码风格**: 项目使用 TypeScript，请确保代码符合类型规范

## License

ISC
