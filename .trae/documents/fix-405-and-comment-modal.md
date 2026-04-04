# 修复计划 (Fix Plan)

## 1. 摘要 (Summary)
本次修复计划旨在解决以下三个问题：
1. **界面美化与“最新更新”排版修复**：调用内置的“界面美化”规则，精修系统视觉架构和无障碍对比度。调整首页的“最新更新”与“AI工具”标题齐平，并且随页面上下滚动（不固定）。
2. **修复后台评论审核/删除 405 报错**：由于 Vercel Serverless 路由与前端调用的动态路由 `/api/comments/:id` 不匹配，导致 `PUT` 和 `DELETE` 请求被回退到静态的 `index.html` 从而报 405 Method Not Allowed。我们将修复前端 API 调用方式，使其将 `id` 放入 Body 中请求 `/api/comments` 根路径。
3. **评论提交弹窗反馈**：将目前位于 `ArticleDetail.tsx` 底部的内联评论表单重构为 Modal 弹窗形式。在提交成功后展示友好的状态反馈，提升用户体验。

## 2. 现状分析 (Current State Analysis)
*   **405 报错问题**：`src/services/api.ts` 中 `updateComment` 和 `deleteComment` 方法向 `/comments/${id}` 发送请求。而在 Vercel 的 `api/comments/index.js` 仅支持 `/api/comments` 路由，并期望从 `req.body` 或 `req.query` 中获取 `id`。由于路由不匹配，Vercel 将请求 Rewrite 给了 `index.html`，静态文件拒绝 `PUT` 导致 405。
*   **UI 与排版问题**：虽然上一轮已经移除了 `sticky top-28`，但您提到“最新更新”仍需优化，同时要求使用界面美化技能进行视觉重构。
*   **评论交互**：`ArticleDetail.tsx` 现有的表单直接显示在页面底部，提交后只通过右上角 Toast 提示，用户感知弱。

## 3. 拟进行的修改 (Proposed Changes)

### 3.1 修复 405 报错 (API 路径对齐)
*   **目标文件**：`src/services/api.ts`
*   **修改内容**：
    *   修改 `updateComment`，将请求路径改为 `/comments`，并将 `id` 合并到 `body` 中：`body: JSON.stringify({ id, ...comment })`。
    *   修改 `deleteComment`，将请求路径改为 `/comments`，并将 `id` 放入 `body` 中：`body: JSON.stringify({ id })`。

### 3.2 提取并重构评论表单为 Modal
*   **目标文件**：`src/pages/ArticleDetail.tsx`
*   **修改内容**：
    *   在组件状态中引入 `isCommentModalOpen` 和 `submitSuccess`。
    *   将原有的表单 JSX 移动到一个带有 `fixed inset-0 z-50 backdrop-blur-sm bg-black/40` 的 Modal 遮罩层内。
    *   在原表单位置放置一个“写评论”按钮来唤醒 Modal。
    *   在 `handleCommentSubmit` 成功分支中，设置 `submitSuccess(true)`，让 Modal 内部展示“✅ 提交成功，等待审核”的 UI 状态，并在 2 秒后自动关闭 Modal 重置状态。

### 3.3 界面美化与最新更新齐平
*   **目标文件**：`src/pages/Home.tsx` 及相关 CSS
*   **修改内容**：
    *   进一步确认 `Home.tsx` 中 `lg:col-span-3` 容器已移除 `sticky` 并且拥有合适的 `pt`（例如 `pt-24` 或与右侧严格对应的 margin/padding）。
    *   应用“界面美化”原则，检查 heading 层级和对比度（如暗黑模式下的文字颜色）。

### 3.4 解决 `url.parse()` 弃用警告
*   **说明**：Vercel 日志中的 `url.parse()` 警告来自于 Node.js 内部或某些旧依赖（如微小的中间件）。由于不影响核心逻辑且非直接调用代码，本次不作为主逻辑修改，但会通过锁定依赖版本尽量避免。

## 4. 假设与决策 (Assumptions & Decisions)
*   **决策**：为了不破坏现有逻辑，Modal 暂时写在 `ArticleDetail.tsx` 内部，而不是抽离成单独的文件。
*   **假设**：后端 `api/comments/index.js` 已经能正确处理 `req.body.id`（通过之前的源码查阅已确认 `const id = req.query.id || req.body.id;` 是支持的）。

## 5. 验证步骤 (Verification Steps)
1. 在文章详情页点击“写评论”，确认 Modal 正确弹出。
2. 填写评论并提交，确认 Modal 内出现成功状态提示，并在 2 秒后自动关闭，同时后台无 500 报错。
3. 进入 Admin 页面，点击审核通过或拒绝，确认控制台不再出现 405 Method Not Allowed 错误，并且状态更新成功。
4. 检查首页“最新更新”板块，确认其顶部与右侧“AI工具”齐平，并随页面自然滚动。