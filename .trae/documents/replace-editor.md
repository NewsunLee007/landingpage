# 修复计划 (Fix Plan)

## 1. 摘要 (Summary)
本次更新旨在解决后台文章编辑器对 Markdown 格式支持不理想、排版繁琐的问题。
我们将把目前后台使用的富文本编辑器（TinyMCE）替换为专业且稳定的 Markdown 分栏编辑器 `@uiw/react-md-editor`。同时，为了兼容旧文章（以 HTML 格式存储），我们将引入 `turndown` 库，在编辑旧文章时自动将 HTML 转换为 Markdown。

## 2. 现状分析 (Current State Analysis)
*   **当前编辑器**：`src/pages/Admin.tsx` 中目前使用的是 `@tinymce/tinymce-react`。这是一个典型的富文本（WYSIWYG）编辑器，它输出和绑定到 `currentArticle.content` 的数据是 HTML 格式。
*   **格式割裂问题**：前端展示页 `ArticleDetail.tsx` 已经支持通过 `react-markdown` 渲染 Markdown，但由于后台使用的是 TinyMCE，导致作者无法直接编写和预览纯正的 Markdown 语法，排版体验不佳。
*   **历史数据兼容**：数据库中已有的文章内容是 HTML 格式（前端通过正则 `<[a-z][\s\S]*>` 来判断）。如果直接将 HTML 喂给新的 Markdown 编辑器，会显示满屏的 HTML 源码标签。

## 3. 拟进行的修改 (Proposed Changes)

### 3.1 依赖管理
*   **卸载旧依赖**：移除 `@tinymce/tinymce-react` 和 `tinymce`。
*   **安装新依赖**：安装 `@uiw/react-md-editor`（Markdown 编辑器）以及 `turndown` 和 `@types/turndown`（用于 HTML 转 Markdown）。

### 3.2 替换后台编辑器组件
*   **目标文件**：`src/pages/Admin.tsx`
*   **修改内容**：
    *   移除 TinyMCE 的 `<Editor />` 及其庞大的配置项（`init`、`plugins`、`toolbar` 等）。
    *   引入并使用 `<MDEditor />` 组件。
    *   **暗黑模式适配**：利用项目现有的 `useTheme` hook 获取当前主题（`theme`），并将其传递给外层容器的 `data-color-mode={theme}` 属性，确保编辑器能随系统或用户切换日/夜间模式。
    *   **图片支持**：`@uiw/react-md-editor` 原生支持直接粘贴或输入 Markdown 图片语法 `![alt](url)`，这与当前项目“输入外部图片链接”的逻辑完美契合。

### 3.3 历史 HTML 数据转换 (兼容旧文章)
*   **目标文件**：`src/pages/Admin.tsx`
*   **修改内容**：
    *   在点击列表中的“编辑”按钮（触发 `setCurrentArticle(article)`）时，拦截并检查 `article.content`。
    *   使用与展示页相同的正则 `/<[a-z][\s\S]*>/i.test(article.content)` 判断是否为 HTML。
    *   如果是 HTML，则使用 `new TurndownService().turndown(article.content)` 将其静默转换为 Markdown 字符串，然后再存入 `currentArticle.content` 供编辑器使用。
    *   这样一来，旧文章在打开编辑时会自动变成整洁的 Markdown 源码，保存后数据库里存的也就是纯 Markdown 了，实现了数据的平滑过渡。

## 4. 假设与决策 (Assumptions & Decisions)
*   **编辑器选型决策**：虽然有像 MDXEditor 这样的所见即所得方案，但考虑到极客体验和系统稳定性，最终选择 `@uiw/react-md-editor`。它提供经典的“左侧源码、右侧实时预览”分栏模式，所写即所得，对 Markdown 表格、代码块等原生语法的支持最为纯粹和稳定。
*   **图片上传机制**：当前系统本身没有实现本地图片文件上传至服务器的接口，全部依赖填写外部 URL。因此，新的编辑器也将保持这一逻辑，作者可以直接通过 Markdown 语法插入外部图床链接，无需额外开发复杂的富媒体直传后端的接口。

## 5. 验证步骤 (Verification Steps)
1.  **编辑器加载**：进入 Admin 后台点击“撰写新随笔”，确认页面成功加载了分栏的 Markdown 编辑器，且无 TinyMCE 残留。
2.  **暗黑模式响应**：在系统的日间/夜间模式切换时，确认编辑器的背景色和代码高亮主题能正确跟随切换。
3.  **旧数据兼容**：在后台列表中找一篇以前用 TinyMCE 写的旧文章点击“编辑”，确认编辑器内显示的是干净的 Markdown 源码（如 `# 标题`），而不是 `<h1>标题</h1>` 这样的 HTML 标签。
4.  **保存与展示**：在编辑器中编写包含表格、代码块等语法的 Markdown 内容，点击保存。去前台首页进入该文章详情页，确认内容被完美解析和排版。