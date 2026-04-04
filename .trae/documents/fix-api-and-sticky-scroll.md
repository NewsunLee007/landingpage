# 修复计划 (Fix Plan)

## 1. 摘要 (Summary)
本次更新旨在修复三个主要问题：
1. 首页“最新更新”板块无法随页面滚动而自然跟随的问题。
2. 前端无法发布评论（报错 405 Method Not Allowed 和 `<!doctype` 解析错误）的问题。
3. 网站 Admin 后台无法发布文章，出现相同的获取数据解析错误的问题。
修复完成后，会将所有代码变动初始化为 Git 仓库并推送到您指定的 GitHub 远程仓库 `NewsunLee007/landingpage` 中。

## 2. 现状分析 (Current State Analysis)
*   **最新更新滚动问题**：在 `src/pages/Home.tsx` 中，“最新更新”模块目前只是一个普通的静态 `div` 容器，其父级使用了 CSS Grid。因为它没有添加 `sticky` 粘性定位属性，所以在页面往下滚动时会被滚动出可视区域。
*   **评论与后台文章发布报错问题**：通过您的截图和日志可以发现，前端向 `/comments` 等路由发送了 `POST` 和 `GET` 请求，但在 Vercel 的部署环境下，所有后端接口都放置在 `api/` 目录下（如 `api/comments/index.js`），并受 `vercel.json` 中的 `/api/(.*)` 重写规则控制。如果前端环境变量 `VITE_API_URL` 配置为了根域名（如 `https://main.newsunenglish.com`），这会导致请求直接打到静态页面上（返回了 `index.html`，所以出现 `<!doctype` 的 JSON 解析错误；而对静态页面的 POST 请求则返回 `405 Method Not Allowed`）。

## 3. 拟进行的修改 (Proposed Changes)

### 3.1 修复“最新更新”板块的粘性跟随滚动
*   **目标文件**：`src/pages/Home.tsx`
*   **修改内容**：
    *   定位到“最新更新”所在的包裹元素（大约在第 42 行），为其添加 Tailwind CSS 的 `sticky top-28` 样式。
    *   这样当页面向下滚动时，该板块会在距离顶部 `7rem` (28单位，避开 Navbar 高度) 的位置吸顶停留。

### 3.2 修复 API 基础路径配置
*   **目标文件**：`src/services/api.ts`
*   **修改内容**：
    *   重构 `API_URL` 的初始化逻辑。如果环境变量传入了 Vercel 的域名，确保将其标准化，始终以 `/api` 结尾。
    *   具体做法是：去除末尾可能多余的 `/`，如果处理后的路径不以 `/api` 结尾且不是纯粹的 `/api`，则自动拼接 `/api`。保证所有请求正确路由至 Vercel Serverless Functions。

### 3.3 同步至 GitHub 仓库
*   **目标动作**：
    *   在项目根目录运行 `git init`。
    *   设置远端仓库：`git remote add origin git@github.com:NewsunLee007/landingpage.git`。
    *   添加所有更改 `git add .` 并创建提交 `git commit -m "fix: 修复 admin 后台文章发布和更新问题，修复最新更新板块布局问题"`。
    *   推送代码：`git push -u origin main`（或 master 分支）。

## 4. 假设与决策 (Assumptions & Decisions)
*   **假设**：您本地已配置好访问 GitHub 的 SSH Key（因为您提供了 `git@github.com:...` 格式的地址）。如果推送失败，可能需要协助检查本地 SSH 密钥。
*   **决策**：考虑到 Navbar 的高度为 `h-20`（80px），将“最新更新”板块的粘性触发点设为 `top-28`（112px）是最合适的，既不会被 Navbar 遮挡，也留有舒适的视觉间距。

## 5. 验证步骤 (Verification Steps)
1. 运行本地开发服务器或在 Vercel 预览部署中，向下滚动首页，检查“最新更新”是否正确吸顶跟随。
2. 检查发起评论或后台文章操作时的网络请求（Network Tab），确认请求 URL 已正确包含 `/api/` 路径（如 `https://main.newsunenglish.com/api/comments`）。
3. 检查控制台无 405 和 JSON 解析报错。
4. 确认代码成功 Push 到 GitHub `NewsunLee007/landingpage`。