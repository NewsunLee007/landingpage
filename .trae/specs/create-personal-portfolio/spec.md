# 个人主页与应用矩阵入口 (New Sun English Portal)

## Why
用户（李老师/New Sun Lee）作为教务处主任和英语老师，已经独立开发了多个高质量的教育类 Web 应用，涵盖 AI 作文批改（Write Ascend）、教务编排（EMS）、词汇系统、教学常规查询等，并部署在 `newsunenglish.com` 的各个子域名下。
目前缺少一个主域名（`www.newsunenglish.com`）作为统一入口。需要构建一个“应用矩阵/个人作品集” Landing Page，对这些分散的工具进行分类整合，既方便用户（学生、老师、管理者）快速访问，又能极大地提升个人的专业品牌形象（懂技术的教育专家）。

## What Changes
- [x] 开发 `www.newsunenglish.com` 的主页应用。
- [x] **Hero Section**: 打造品牌感，“New Sun English - 科技赋能教育与管理”。
- [x] **应用矩阵分类展示 (Bento Grid 布局)**:
  - **智能教学辅助 (Smart Teaching)**: Write Ascend, Vocab System, Passage Editing, Schulte Grid.
  - **教务与管理 (Management)**: EMS 教务编排中心, 教学常规查询系统.
  - **展示与其它 (Showcase)**: Display 系列网页.
- [x] **关于开发者 (About)**: 突出“教务主任 + 英语老师 + 独立开发者”的跨界优势。

## Impact
- Affected specs: `newsunenglish.com` 根域名主页，将作为所有子系统的流量枢纽。
- Affected code: 全新的前端落地页项目。

## ADDED Requirements
### Requirement: 应用卡片交互
系统应当提供一个分类清晰的卡片式导航。每个应用的展示卡片需要包含：
- 应用名称与图标
- 核心功能标签（如 `AI 驱动`, `效率工具`, `管理系统`）
- 一句话简介（提取自子域名的核心功能）
- 跳转到对应子域名的链接（在新标签页打开）

#### Scenario: 用户查找特定工具
- **WHEN** 用户需要使用作文批改系统
- **THEN** 用户可以在主页的“智能教学辅助”板块快速找到 Write Ascend 卡片，点击后新开窗口跳转至 `writeascend.newsunenglish.com`。

### Requirement: 响应式与性能
考虑到教师和学生可能会通过微信等移动端频繁访问，页面必须做到移动端优先，卡片在手机端应流畅地降级为单列布局。
