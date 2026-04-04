# 个人博客与应用展示平台

这是一个基于 React + TypeScript + Vite 的个人博客和应用展示平台，包含前端展示和后端管理功能。

## 项目结构

```
.
├── backend/          # 后端服务（Express + Prisma）
├── src/              # 前端源代码
├── public/           # 静态资源
├── index.html        # 入口 HTML
├── package.json      # 前端依赖配置
└── README.md         # 本文件
```

## 功能特性

### 前端功能

- 📝 **博客文章展示** - 查看和浏览博客文章
- 🛠️ **应用工具展示** - 展示个人开发的应用和工具
- 🎨 **响应式设计** - 适配不同屏幕尺寸
- 🌙 **深色/浅色主题** - 支持主题切换
- 🔐 **管理员后台** - 用于管理文章和应用

### 后端功能

- 👤 **用户认证** - JWT 令牌认证
- 📄 **文章管理** - 创建、编辑、删除文章
- 📱 **应用管理** - 创建、编辑、删除应用项
- 📊 **日志记录** - 完整的操作日志记录
- 🗄️ **数据库集成** - 使用 Prisma ORM 管理 SQLite 数据库

## 快速开始

### 前置要求

- Node.js (版本 18 或更高)
- npm 或 yarn

### 安装和运行

#### 1. 安装依赖

```bash
# 安装前端依赖
npm install

# 安装后端依赖
cd backend
npm install
cd ..
```

#### 2. 配置环境变量

**前端环境变量**（可选，用于自定义配置）：

```bash
cp .env.example .env
```

**后端环境变量**：

```bash
cd backend
cp .env.example .env
```

编辑 `backend/.env` 文件，根据需要修改配置项（特别是 `JWT_SECRET`）。

#### 3. 初始化后端数据库

```bash
cd backend
npx prisma migrate dev
cd ..
```

#### 4. 启动开发服务器

**同时启动前端和后端**：

打开两个终端窗口：

终端 1（启动后端）：
```bash
cd backend
npm run dev
```

终端 2（启动前端）：
```bash
npm run dev
```

前端将运行在 `http://localhost:5173`，后端运行在 `http://localhost:3001`。

## 详细文档

### 后端文档

关于后端的安装、配置、API 接口等详细信息，请参阅 [后端 README](./backend/README.md)。

### 开发指南

#### 后端开发

后端使用 Express.js + Prisma + TypeScript 构建。主要功能包括：

- 用户认证（JWT）
- 文章 CRUD 操作
- 应用项 CRUD 操作
- 完整的日志系统

更多信息请查看 [backend/README.md](./backend/README.md)。

#### 前端开发

前端使用 React + TypeScript + Vite 构建。主要组件包括：

- 首页展示
- 文章详情页
- 应用工具页
- 管理员后台

## 技术栈

### 前端

- **React 18** - UI 框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **CSS** - 样式（支持主题切换）

### 后端

- **Express.js** - Web 框架
- **Prisma** - ORM 和数据库管理
- **SQLite** - 开发环境数据库
- **TypeScript** - 类型安全
- **JWT** - 身份认证
- **bcrypt** - 密码加密

## 默认管理员账号

- 用户名：`admin`
- 密码：`newsun2024`

**重要提示**：请在生产环境中修改默认密码！

## 许可证

ISC
