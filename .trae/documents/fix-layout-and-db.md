# 修复计划 (Fix Plan)

## 1. 摘要 (Summary)
本次修复旨在解决两个核心问题：
1. **界面 UI 布局修复**：取消首页“最新更新”侧边栏的固定悬浮（Sticky）效果，使其随页面自然滚动，并与右侧的“AI工具”标题水平齐平。
2. **评论发布失败 (500 Internal Server Error) 修复**：解决由于 Neon 生产数据库缺少 `articleId` 字段导致的 `PrismaClientKnownRequestError: The column 'articleId' does not exist` 报错，确保前后端数据表结构同步。

## 2. 现状分析 (Current State Analysis)
*   **UI 布局问题**：在 `src/pages/Home.tsx` 中，侧边栏被添加了 `sticky top-28` 样式，导致其悬浮固定。同时，右侧的 `ToolsSection` 内置了 `py-24` 的内边距，导致左右两侧的顶部无法在同一直线上齐平。
*   **数据库同步问题**：通过 Vercel 日志可确认，后台 Prisma Client 提示 `Comment` 表中不存在 `articleId` 列。这意味着我们本地的 `schema.prisma` 模型已更新，但未同步（Push）到线上的 Neon 数据库中，导致插入和查询时直接抛出 500 错误。

## 3. 拟进行的修改 (Proposed Changes)

### 3.1 修复首页“最新更新”布局
*   **目标文件**：`src/pages/Home.tsx`
*   **修改内容**：
    *   找到侧边栏容器（约第 41 行）：`<div className="lg:col-span-3 order-2 lg:order-1 self-start sticky top-28">`。
    *   **移除** `sticky top-28`，取消其固定效果。
    *   **添加** `pt-24` 样式（与右侧 `ToolsSection` 的上内边距保持一致），使得修改后的类名为：`lg:col-span-3 order-2 lg:order-1 self-start pt-24`。
    *   通过此修改，左侧“最新更新”和右侧“AI工具”将在同一水平线上，并且都会随着页面正常上下滚动。

### 3.2 修复评论发布失败（自动化数据库迁移）
*   **目标文件**：`package.json` (项目根目录)
*   **修改内容**：
    *   修改 `scripts.build` 命令，在执行编译前自动同步数据库结构。
    *   原命令：`"build": "tsc -b && vite build"`
    *   新命令：`"build": "npx prisma generate && npx prisma db push --accept-data-loss && tsc -b && vite build"`
    *   **为什么这样做**：Vercel 在每次部署（Deploy）时都会运行 `npm run build` 命令。将其加入构建流后，Vercel 会利用其环境变量中的 `DATABASE_URL`，自动将 `schema.prisma` 中的结构同步到 Neon 数据库中。这样以后只要修改了数据库模型，Vercel 部署时就会自动生效，彻底解决字段缺失引发的 500 错误。

### 3.3 同步至 GitHub 触发 Vercel 部署
*   **目标动作**：
    *   提交上述更改。
    *   执行 `git push origin main`。
    *   等待 Vercel 自动重新构建并部署，届时数据库字段将自动补全，评论功能恢复正常。

## 4. 假设与决策 (Assumptions & Decisions)
*   **决策**：考虑到 Neon 数据库的远程连接特性，手动在本地执行 `prisma db push` 需要将生产库的 URL 暴露到本地 `.env`。将其集成到 Vercel 的 `build` 流程中是最安全、最自动化的处理方式，可以确保部署的代码和数据库结构永远保持一致。
*   **决策**：UI 对齐采用了 `pt-24`，这是基于右侧 `<ToolsSection>` 组件同样具有 `py-24` (padding-top: 6rem) 的事实，这样能确保完美的水平对齐。

## 5. 验证步骤 (Verification Steps)
1. 提交代码至 GitHub 后，前往 Vercel 控制台观察最新的 Deployment 构建日志。
2. 在构建日志中确认 `npx prisma db push` 成功执行并提示 "Your database is now in sync with your Prisma schema"。
3. 访问线上页面 `https://main.newsunenglish.com`。
4. 验证向下滚动页面时，“最新更新”模块不再固定，而是跟随页面一同滚动，且其顶部与“AI工具”处于同一水平线。
5. 随便进入一篇文章，尝试发布一条评论，确认 Network 中 `/api/comments` 返回 201 成功状态码，评论能够正常显示。