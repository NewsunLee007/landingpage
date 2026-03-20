# Hero 区域图片轮播背景优化计划

## 目标
当前用户提供的图片在卡片中因为图床防盗链或链接问题可能无法正常显示（前序验证显示 404）。为了更好地利用这些图片并增强页面的视觉冲击力，计划将这些图片作为首页顶部（Hero Section）的动态轮播背景（或者幻灯片画廊），营造出绚烂且清爽的视觉体验。

## 实施步骤

1. **提取与准备图片资源**
   - 收集用户提供的 7 张图片链接：
     - `https://p.ipic.vip/ppvs3g.jpg`
     - `https://p.ipic.vip/gwurf7.jpg`
     - `https://p.ipic.vip/js32gc.jpg`
     - `https://p.ipic.vip/ls9q8u.jpg`
     - `https://p.ipic.vip/t6g69n.jpg`
     - `https://p.ipic.vip/u7kolm.jpg`
     - `https://p.ipic.vip/zaas43.jpg`
   - （注：尽管网络请求可能返回 404，但前端通过 `<img>` 或 CSS `background-image` 渲染时可能因为无 Referer 限制而能正常显示，我们将直接在代码中使用它们）。

2. **改造 Hero Section (首页顶部区域)**
   - 在 `src/pages/Home.tsx` 中修改 Hero Section 的结构。
   - 引入一个定时器（或利用 `framer-motion` 的 `AnimatePresence`）来实现这 7 张图片的自动淡入淡出（Fade-in / Fade-out）轮播。

3. **视觉与样式调整 (UI/UX)**
   - **背景层**：将轮播图片设置为绝对定位的背景层 (`absolute inset-0 object-cover`)。
   - **遮罩层 (Overlay)**：为了确保文字的可读性，在图片上方添加一个半透明的渐变遮罩（例如深色到透明的渐变，或者磨砂玻璃效果 `backdrop-blur`）。
   - **前景层**：保持现有的文案（"让英语教学 更具启发性" 等）居中显示在最上层。

4. **代码重构细节**
   - 在 `Home.tsx` 顶部定义图片数组。
   - 使用 React 的 `useState` 和 `useEffect` 创建一个每 5-6 秒切换一次索引的逻辑。
   - 确保轮播切换时有平滑的 CSS 或 Framer Motion 动画过渡，避免生硬闪烁。

## 预期效果
用户一打开页面，就能看到整个首屏背景是这些精美图片的缓慢轮播切换，配合之前调整过的文艺科技风排版，彻底解决“页面太素”的问题，同时彰显 Vibe Coder 和教育者的气质。