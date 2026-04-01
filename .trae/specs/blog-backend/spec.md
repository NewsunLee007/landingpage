# 博客后端系统 - 产品需求文档

## Overview
- **Summary**: 为现有的个人主页搭建后端系统，提供管理员账户认证和文章 CRUD 操作的 API 服务。
- **Purpose**: 解决当前主页缺乏独立后端服务的问题，提供持久化数据存储，确保文章内容在多设备环境下的一致性和安全性。
- **Target Users**: 管理员（作者）和访问者。

## Goals
- 实现管理员账户认证系统
- 提供文章的完整 CRUD 操作接口
- 实现数据的持久化存储
- 提供与现有前端代码兼容的 RESTful API

## Non-Goals (Out of Scope)
- 不实现多用户系统（仅单个管理员账户）
- 不实现复杂的用户注册功能
- 不实现评论系统
- 不实现图片上传功能（使用外部图床链接
- 不实现用户访问统计或评论功能

## Background & Context
- 当前系统当前使用 LeanCloud 作为可选后端，但主要依赖 localStorage 本地存储，数据无法在多设备间共享
- 项目使用 React + Vite 构建的前端应用
- 已有完整的管理员页面 UI 组件
- 项目目标是实现完整的博客/个人主页功能

## Functional Requirements
- **FR-1**: 管理员登录认证
- **FR-2**: 文章创建（Create）
- **FR-3**: 文章读取（Read - 列表和详情）
- **FR-4**: 文章更新（Update）
- **FR-5**: 文章删除（Delete）
- **FR-6**: 数据持久化存储

## Non-Functional Requirements
- **NFR-1**: API 响应时间 < 500ms
- **NFR-2**: 支持至少 100 篇文章的存储和查询
- **NFR-3**: 密码使用哈希加密存储
- **NFR-4**: API 接口需与现有前端数据结构兼容

## Constraints
- **Technical**: 使用 Node.js + Express 作为后端框架
- **Business**: 后端需轻量、易部署、成本低
- **Dependencies**: SQLite 作为数据库（无需额外数据库服务）

## Assumptions
- 管理员账户可通过环境变量配置
- 文章内容使用 Markdown 格式
- 前端使用环境变量配置 API 地址
- 部署环境支持 Node.js 应用

## Acceptance Criteria

### AC-1: 管理员登录
- **Given**: 后端服务已启动
- **When**: 管理员使用正确的用户名和密码登录
- **Then**: 系统返回有效的 JWT 令牌
- **Verification**: `programmatic`

### AC-2: 文章列表获取
- **Given**: 后端服务已启动且有文章数据
- **When**: 访问者请求文章列表
- **Then**: 返回所有文章的标题、摘要、日期等信息
- **Verification**: `programmatic`

### AC-3: 文章详情获取
- **Given**: 后端服务已启动且存在指定 ID 的文章
- **When**: 访问者请求文章详情
- **Then**: 返回文章的完整内容
- **Verification**: `programmatic`

### AC-4: 文章创建
- **Given**: 管理员已登录且有有效 JWT 令牌
- **When**: 管理员提交新文章
- **Then**: 文章被保存到数据库并返回新文章的 ID
- **Verification**: `programmatic`

### AC-5: 文章更新
- **Given**: 管理员已登录且有有效 JWT 令牌
- **When**: 管理员提交更新的文章内容
- **Then**: 数据库中的文章被更新
- **Verification**: `programmatic`

### AC-6: 文章删除
- **Given**: 管理员已登录且有有效 JWT 令牌
- **When**: 管理员删除文章
- **Then**: 数据库中的文章被删除
- **Verification**: `programmatic`

## Open Questions
- [ ] 是否需要实现用户管理功能？
- [ ] 是否需要实现文章分类功能？
