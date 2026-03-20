import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AppItem {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
  iconName: string; // store icon name to avoid storing React nodes
  imageUrl?: string; // Optional image URL for the card
  isPrivate?: boolean; // Whether the app requires a password
}

export interface Article {
  id: string;
  title: string;
  content: string;
  date: string;
  summary: string;
  imageUrl?: string;
}

interface StoreState {
  apps: AppItem[];
  articles: Article[];
  addApp: (app: AppItem) => void;
  updateApp: (id: string, app: Partial<AppItem>) => void;
  deleteApp: (id: string) => void;
  addArticle: (article: Article) => void;
  deleteArticle: (id: string) => void;
}

const initialApps: AppItem[] = [
  {
    id: 'writeascend',
    title: 'Write Ascend',
    description: 'AI 驱动的英语作文智能批改系统，支持多维度评分与年级难度控制。',
    url: 'https://writeascend.newsunenglish.com/',
    category: '智能教学辅助',
    tags: ['AI', '教学工具'],
    iconName: 'Code',
    imageUrl: 'https://p.ipic.vip/ppvs3g.jpg'
  },
  {
    id: 'vocab',
    title: 'Vocab System',
    description: '支持 Excel 一键导入的词汇管理与训练系统，提升学生单词记忆效率。',
    url: 'https://vocab-system.newsunenglish.com/',
    category: '智能教学辅助',
    tags: ['数据驱动', '效率'],
    iconName: 'GraduationCap',
    imageUrl: 'https://p.ipic.vip/gwurf7.jpg'
  },
  {
    id: 'passage',
    title: 'Passage Editing',
    description: '智能语篇编辑工具，为英语阅读和改错提供数字化辅助。',
    url: 'https://passage-editing.newsunenglish.com/',
    category: '智能教学辅助',
    tags: ['阅读', '工具'],
    iconName: 'Layout',
    imageUrl: 'https://p.ipic.vip/js32gc.jpg'
  },
  {
    id: 'schulte',
    title: 'Schulte Grid',
    description: '舒尔特方格注意力训练工具，通过趣味交互提升学生专注力。',
    url: 'https://schultegrid.newsunenglish.com/',
    category: '智能教学辅助',
    tags: ['专注力', '游戏化'],
    iconName: 'Layout',
    imageUrl: 'https://p.ipic.vip/ls9q8u.jpg'
  },
  {
    id: 'ems',
    title: 'EMS 数据中心',
    description: '数字化排考系统，自动化管理学年、学期、考试场次与学科安排。',
    url: 'https://ems.newsunenglish.com/',
    category: '教务与管理',
    tags: ['教务', '管理系统'],
    iconName: 'Globe',
    imageUrl: 'https://p.ipic.vip/t6g69n.jpg'
  },
  {
    id: 'teaching',
    title: '初中教学常规查询',
    description: '汇集最新版各学科教学常规与管理指引，方便快速查询。',
    url: 'https://teaching.newsunenglish.com/',
    category: '教务与管理',
    tags: ['规范', '查询'],
    iconName: 'Layout',
    imageUrl: 'https://p.ipic.vip/u7kolm.jpg'
  },
  {
    id: 'display01',
    title: 'Display 01',
    description: '前端交互与创意展示网页 01（需要访问密码）。',
    url: 'https://display01.newsunenglish.com/',
    category: '综合展示',
    tags: ['前端', '私密'],
    iconName: 'Layout',
    imageUrl: 'https://p.ipic.vip/zaas43.jpg',
    isPrivate: true
  },
  {
    id: 'display02',
    title: 'Display 02',
    description: '前端交互与创意展示网页 02。',
    url: 'https://display2.newsunenglish.com/',
    category: '综合展示',
    tags: ['前端', 'UI/UX'],
    iconName: 'Layout',
    imageUrl: 'https://p.ipic.vip/b74x3r.jpg'
  },
  {
    id: 'display03',
    title: 'Display 03',
    description: '前端交互与创意展示网页 03（需要访问密码）。',
    url: 'https://display3.newsunenglish.com/',
    category: '综合展示',
    tags: ['前端', '私密'],
    iconName: 'Layout',
    imageUrl: 'https://p.ipic.vip/4hblep.jpg',
    isPrivate: true
  }
];

const initialArticles: Article[] = [
  {
    id: '1',
    title: '用技术重塑英语学习体验',
    summary: '这里是我整合所有英语教育类辅助工具的全新门户。',
    content: `作为一名扎根一线多年的英语教师，我深知传统英语教学中的痛点与瓶颈。

在日复一日的批改、排考和练习中，我常常思考：**有没有一种方法，能让繁杂的教务变得高效，让枯燥的练习变得有趣？**

正是带着这样的疑问，我开始自学编程，成为了一名热衷于探索前沿技术的 **Vibe Coder**。

## 为什么要做这个数字实验室？

传统的英语学习往往局限于书本和试卷，而我相信，技术可以打破物理空间的限制，为学生创造更沉浸、更个性化的学习体验。

在这个主页上，你可以看到我将脑海中闪现的教学灵感，转化为一行行跳动的代码：

*   **Write Ascend**：它不仅是一个批改工具，更是学生写作路上的 AI 导师。
*   **Vocab System**：用数据驱动的方式，让单词记忆不再是死记硬背。
*   **EMS 数据中心**：将教务人员从繁琐的表格中解放出来，将更多时间还给教育本身。

## 技术与人文的交汇

我并不拘泥于传统的编程范式，而是善于利用 AI 工具作为我的“副驾驶”。这极大地缩短了从“想法”到“产品”的距离。

这不仅仅是工具的堆砌，更是我对教育事业热爱的另一种极具创造力的表达方式。

未来，我还会在这里分享更多关于**英语教学法**、**AI 辅助教学**以及 **Web 开发**的思考与实践。感谢你的访问，希望这些工具能给你带来启发！`,
    date: new Date().toISOString().split('T')[0],
    imageUrl: 'https://p.ipic.vip/198jan.jpg'
  }
];

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      apps: initialApps,
      articles: initialArticles,
      addApp: (app) => set((state) => ({ apps: [...state.apps, app] })),
      updateApp: (id, updatedApp) => set((state) => ({
        apps: state.apps.map(app => app.id === id ? { ...app, ...updatedApp } : app)
      })),
      deleteApp: (id) => set((state) => ({
        apps: state.apps.filter(app => app.id !== id)
      })),
      addArticle: (article) => set((state) => ({
        articles: [article, ...state.articles]
      })),
      deleteArticle: (id) => set((state) => ({
        articles: state.articles.filter(article => article.id !== id)
      })),
    }),
    {
      name: 'newsun-storage-v6', // Changed storage name to force cache reset
    }
  )
);