# 修复与优化计划 (Fix & Enhancement Plan)

## 1. 摘要 (Summary)
本次计划将解决两个主要问题：
1. **Markdown 兼容性提升**：引入 `remark-gfm` 插件，使系统能够正确解析并渲染 Markdown 表格、删除线等高级格式。
2. **AI 工具列表排序优化**：在数据库和前后端 API 中新增应用的点击量 (`clicks`) 统计。将首页的 AI 工具列表修改为“智能排序”：优先按照 `clicks` 降序排列（最热门的在前），如果点击量相同，则按照 `updatedAt` 降序排列（最新修改的在前）。

## 2. 现状分析 (Current State Analysis)
*   **Markdown 渲染缺失插件**：`ArticleDetail.tsx` 中使用的 `react-markdown` 目前未配置任何插件。标准 CommonMark 不支持表格（Table），导致编辑器保存的文章如果包含表格等 GFM (GitHub Flavored Markdown) 格式时无法正常展示。
*   **应用排序缺失字段**：目前的 `AppItem` 模型和 `schema.prisma` 都不包含点击量字段。`ToolsSection.tsx` 展示应用时，仅根据分类过滤，没有任何排序逻辑（依赖原始数组顺序）。

## 3. 拟进行的修改 (Proposed Changes)

### 3.1 提升 Markdown 兼容性 (支持表格等格式)
*   **目标文件**：`package.json`, `src/pages/ArticleDetail.tsx`
*   **修改内容**：
    *   通过 `npm install remark-gfm` 安装 GitHub Flavored Markdown 插件。
    *   在 `ArticleDetail.tsx` 中导入 `remarkGfm`，并将其配置到 `<ReactMarkdown remarkPlugins={[remarkGfm]}>` 中。
    *   借助于已经配置好的 Tailwind Typography (`prose`)，表格将自动获得美观的样式。

### 3.2 增加应用点击量统计机制
*   **数据库修改** (`backend/prisma/schema.prisma` & `prisma/schema.prisma`)：
    *   在 `AppItem` 模型中新增字段：`clicks Int @default(0)`。
*   **后端 API 修改** (`backend/src/routes/apps.ts` & `api/apps/index.js`)：
    *   在 Express 和 Vercel Serverless 中新增一个 PATCH / PUT 路由 `/api/apps/:id/click`，使用 Prisma 的 `increment: 1` 进行原子操作，安全地增加点击量。
*   **前端 API 及 Store 修改**：
    *   `src/services/api.ts`：增加 `incrementAppClick(id)` 方法调用上述接口。
    *   `src/store/useStore.ts`：在 `AppItem` 接口中增加 `clicks?: number` 字段。在 `useStore` 中增加 `incrementAppClick` Action，在调用 API 的同时，立刻更新本地 `apps` 状态，实现点击量即时响应。

### 3.3 实现应用列表智能排序与点击捕获
*   **目标文件**：`src/components/home/ToolsSection.tsx`, `src/components/ui/AppCard.tsx`, `src/components/ui/AppListItem.tsx`
*   **修改内容**：
    *   在 `AppCard` 和 `AppListItem` 的外层 `<motion.a>` 标签上，绑定点击事件。当用户点击应用跳转时（或验证密码成功时），调用 `useStore.incrementAppClick(app.id)`。
    *   在 `ToolsSection.tsx` 的 `filteredApps` 的 `useMemo` 中加入排序逻辑：
        1. 首先按照 `clicks` 降序（从大到小）。
        2. 如果 `clicks` 相同，则按 `updatedAt` 降序（最新在前）。

## 4. 假设与决策 (Assumptions & Decisions)
*   **决策**：点击量的增加采用前端先行（Optimistic Update）策略，即在点击链接的瞬间，前端 Zustand Store 立即将该应用的 `clicks + 1` 并触发重排，随后异步向后端发送统计请求。这样即便网络有延迟，用户的界面交互也是极速的。
*   **假设**：用户在管理后台创建的“旧应用”默认 `clicks` 都为 0。排序时，他们将依据最后修改时间 `updatedAt` 排序，这完全符合用户的要求。

## 5. 验证步骤 (Verification Steps)
1.  **Markdown 表格验证**：查看包含表格的文章详情页，确认表格能够被正确解析并呈现 Tailwind Typography 的表格样式，不再是错乱的文本。
2.  **数据库与接口验证**：确认 `prisma db push` 执行成功，通过 Vercel 或本地 Network 观察 `/api/apps/:id/click` 接口是否返回 200。
3.  **排序验证**：在首页“AI工具”板块，点击任意一个排在后面的应用，关闭新打开的页面回到首页，观察该应用是否因为点击量增加（`clicks + 1`）而立即“跃升”到了列表的最前面。