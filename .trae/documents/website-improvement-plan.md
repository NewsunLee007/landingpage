# Newsun 个人门户网站 — 全面改进计划

## 任务理解

对 Newsun 个人门户网站（React 19 + TypeScript + Tailwind CSS 4 + Framer Motion + Zustand）进行全面审查，从安全、SEO、性能、UX、可访问性、代码质量、功能缺失、视觉设计等维度提出改进建议，并按优先级分阶段实施。

---

## 当前状态分析

| 维度 | 现状 |
|------|------|
| **技术栈** | React 19 + TS + Tailwind 4 + Framer Motion + Zustand + React Router 7 + LeanCloud |
| **页面** | 首页（698 行单文件）、文章详情、API Hub、Admin 后台 |
| **数据** | Zustand persist（localStorage），LeanCloud 可选 |
| **安全** | 密码硬编码、localStorage 认证、无 XSS 防护 |
| **SEO** | lang 属性错误、无 meta 标签、无 sitemap |
| **性能** | 无路由懒加载、7 张 Hero 图片全部预加载、无 lazy loading |
| **UX** | 使用原生 prompt/alert、无骨架屏、无暗色模式、无 404 页面 |
| **代码质量** | Home.tsx 过于庞大、Admin 有 Bug、Vite 模板残留 |

---

## 改进计划（按优先级分阶段）

### 第一阶段：安全与基础修复（高优先级）

#### 1.1 修复 Admin 图片字段绑定 Bug
- **文件**: `src/pages/Admin.tsx` 第 186-188 行
- **问题**: App 编辑表单中第二个"图片链接"字段绑定了 `currentArticle` 而非 `currentApp`
- **方案**: 将 `currentArticle` 改为 `currentApp`，并合并两个重复的图片链接字段为一个

#### 1.2 修复 index.html lang 属性
- **文件**: `index.html` 第 2 行
- **问题**: `lang="en"` 但内容全中文
- **方案**: 改为 `<html lang="zh-CN">`

#### 1.3 添加 SEO meta 标签
- **文件**: `index.html`
- **问题**: 仅有 `<title>Newsun</title>`，缺少 description、keywords、Open Graph
- **方案**: 添加 meta description、keywords、og:title、og:description、og:image、twitter:card 等

#### 1.4 解决密码硬编码问题
- **文件**: `src/pages/Admin.tsx`（第 25 行）、`src/pages/Home.tsx`（第 52 行）
- **问题**: Admin 密码 `'newsun2024'` 和私密内容密码 `'123456'` 硬编码在前端
- **方案**:
  - 短期：移至环境变量 `import.meta.env.VITE_ADMIN_PASSWORD`
  - 长期：使用 LeanCloud Cloud Function 做服务端验证

#### 1.5 修复 localStorage 认证状态可篡改
- **文件**: `src/pages/Admin.tsx` 第 9 行
- **问题**: `localStorage.getItem('newsun_admin_auth') === 'true'` 可被控制台绕过
- **方案**:
  - 短期：添加 token 过期机制（存储时间戳，每次检查是否过期）
  - 长期：使用 LeanCloud Session 机制

#### 1.6 清理 Vite 模板残留样式
- **文件**: `src/App.css`
- **问题**: 包含 `.counter`、`.hero`、`#center`、`#next-steps` 等未使用的 Vite 模板样式
- **方案**: 清空文件内容或删除文件

---

### 第二阶段：性能与架构优化（高优先级）

#### 2.1 实现路由级懒加载
- **文件**: `src/App.tsx`
- **问题**: 所有页面同步导入，Admin 后台代码也打包在初始 bundle 中
- **方案**:
  ```tsx
  const Home = lazy(() => import('./pages/Home'));
  const ArticleDetail = lazy(() => import('./pages/ArticleDetail'));
  const ApiHub = lazy(() => import('./pages/ApiHub'));
  const Admin = lazy(() => import('./pages/Admin'));
  ```
  包裹 `<Suspense fallback={<LoadingSpinner />}>`

#### 2.2 优化 Hero 图片加载策略
- **文件**: `src/pages/Home.tsx` 第 8-16 行
- **问题**: 7 张背景图片可能全部预加载
- **方案**:
  - 仅预加载第一张图片（`<link rel="preload">`）
  - 其余图片在轮播到前一刻才加载
  - 添加加载占位背景色

#### 2.3 为非首屏图片添加 loading="lazy"
- **文件**: `src/pages/Home.tsx`（AppCard、技术分享卡片、文章卡片中的 `<img>`）
- **方案**: 为所有非首屏可见的 `<img>` 添加 `loading="lazy"` 属性

#### 2.4 拆分 Home.tsx 为独立组件
- **文件**: `src/pages/Home.tsx`（698 行）
- **方案**: 按功能拆分：
  ```
  src/components/
    layout/Navbar.tsx, Footer.tsx, ScrollToTop.tsx, ViewToggle.tsx
    home/HeroSection.tsx, ToolsSection.tsx, TechShareSection.tsx,
          ArticlesSection.tsx, AboutSection.tsx
    ui/AppCard.tsx, AppListItem.tsx, TechShareCard.tsx,
        ArticleCard.tsx, PasswordModal.tsx, Toast.tsx, Skeleton.tsx
  ```

#### 2.5 抽取技术分享卡片重复代码
- **文件**: `src/pages/Home.tsx` 第 405-546 行
- **问题**: 卡片视图和列表视图有大量重复 JSX，内部/外部链接各一套
- **方案**: 抽取 `TechShareCard` 和 `TechShareListItem` 组件，通过 props 区分链接类型

#### 2.6 添加 404 页面
- **文件**: 新建 `src/pages/NotFound.tsx`，修改 `src/App.tsx`
- **方案**: 添加 `<Route path="*" element={<NotFound />} />`，设计友好的 404 页面

#### 2.7 添加 sitemap.xml 和 robots.txt
- **文件**: `public/sitemap.xml`、`public/robots.txt`
- **方案**: 创建静态文件，列出首页、API Hub 等主要页面

---

### 第三阶段：用户体验提升（中优先级）

#### 3.1 创建全局 Toast 通知系统
- **文件**: 新建 `src/components/ui/Toast.tsx`、`src/store/useToastStore.ts`
- **问题**: 分享功能使用 `alert()`，密码错误使用 `alert()`
- **方案**: 使用 Zustand 管理 toast 状态，支持成功/错误/信息类型，3 秒自动消失，Framer Motion 动画

#### 3.2 创建自定义密码模态框
- **文件**: 新建 `src/components/ui/PasswordModal.tsx`
- **问题**: 私密内容使用 `window.prompt()` 输入密码
- **方案**: Framer Motion 动画模态框，支持密码遮罩输入，内联错误提示

#### 3.3 添加骨架屏/加载状态
- **文件**: 新建 `src/components/ui/Skeleton.tsx`
- **方案**: 为路由切换添加 Suspense fallback，为数据区域添加骨架屏（`animate-pulse`）

#### 3.4 实现暗色模式
- **文件**: `src/index.css`、各组件文件
- **方案**:
  - Tailwind CSS 4 的 `dark:` 变体
  - `<html>` 标签切换 `dark` class
  - `localStorage` + `prefers-color-scheme` 检测偏好
  - 导航栏添加主题切换按钮

#### 3.5 改进移动端导航
- **文件**: 导航栏组件
- **问题**: 当前使用水平滚动按钮组
- **方案**: 实现汉堡菜单，Framer Motion 展开动画，点击后自动收起

#### 3.6 添加回到顶部按钮
- **文件**: 新建 `src/components/layout/ScrollToTop.tsx`
- **方案**: `scroll` 事件监听，滚动超过阈值后显示，Framer Motion 淡入淡出

#### 3.7 导航栏滚动高亮
- **文件**: 导航栏组件
- **方案**: `IntersectionObserver` 监听各 section 可见性，高亮对应导航项

#### 3.8 页面过渡动画
- **文件**: `src/App.tsx`
- **方案**: Framer Motion `AnimatePresence` 包裹路由出口，配合 `useLocation`

---

### 第四阶段：功能完善（中优先级）

#### 4.1 文章搜索功能
- **文件**: 文章区域组件
- **方案**: 添加搜索框，过滤 `title`、`summary`、`content` 字段

#### 4.2 标签系统
- **文件**: `src/store/useStore.ts`（Article 接口添加 `tags`）、文章区域组件
- **方案**: 为文章添加标签字段，支持按标签筛选

#### 4.3 完善文章编辑功能
- **文件**: `src/pages/Admin.tsx`、`src/store/useStore.ts`
- **问题**: `handleSaveArticle` 只有新增逻辑，缺少更新分支
- **方案**: store 添加 `updateArticle` 方法，Admin 添加编辑入口

#### 4.4 联系表单
- **文件**: 新建联系表单组件
- **方案**: 姓名、邮箱、消息字段，使用 LeanCloud 或第三方服务提交

#### 4.5 动态页面标题
- **文件**: 各页面组件
- **方案**: 使用 `react-helmet-async` 或 `@unhead/react` 动态设置 `<title>`

---

### 第五阶段：锦上添花（低优先级）

#### 5.1 更新 favicon
- **文件**: `public/favicon.svg`
- **方案**: 使用主色调 `#2A6049` → `#4A8069` 渐变，添加 `favicon.ico` 和 Apple Touch Icon

#### 5.2 优化 Footer
- **文件**: Footer 组件
- **方案**: 添加快速导航、社交媒体链接、站点介绍，多列布局

#### 5.3 PWA 支持
- **文件**: `public/manifest.json`、`vite.config.ts`
- **方案**: 使用 `vite-plugin-pwa`，配置应用图标和主题色

#### 5.4 RSS 订阅
- **方案**: Vite 插件构建时生成 RSS XML，Footer 添加订阅链接

#### 5.5 评论系统
- **方案**: 集成 Giscus（GitHub Discussions）或基于 LeanCloud 自建

#### 5.6 数据分析
- **方案**: 集成百度统计或隐私友好的 Umami

#### 5.7 可访问性改进
- 为图标按钮添加 `aria-label`
- 添加 `skip-to-content` 链接
- 改善颜色对比度（`text-stone-400` → `text-stone-500`）
- 为搜索框添加关联 `<label>`

---

## 假设与决策

1. **LeanCloud 已配置**：假设用户已或将会配置 LeanCloud（代码中已有集成），安全改进的长期方案依赖 LeanCloud
2. **不引入国际化**：内容全中文，i18n 投入产出比低，暂不实施
3. **保持现有设计风格**：所有改进沿用当前的"文艺科技风"设计语言（绿色主色调 `#2A6049`、圆角玻璃拟态、Framer Motion 动画）
4. **渐进式改进**：每个阶段独立可交付，不要求一次性完成所有改进

## 验证方式

- **安全修复**：检查前端源码中不再包含明文密码
- **SEO**：使用 Lighthouse 审计 SEO 分数
- **性能**：使用 Lighthouse 审计 Performance 分数，确认路由懒加载生效（检查 Network 面板 chunk 文件）
- **UX**：手动测试 Toast、模态框、骨架屏、暗色模式等交互
- **代码质量**：确认 Home.tsx 拆分后单文件不超过 200 行，无 ESLint 警告
- **功能**：测试 404 页面、文章搜索、标签筛选、文章编辑等新功能
