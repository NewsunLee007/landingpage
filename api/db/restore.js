import { PrismaClient } from '@prisma/client';

let prisma;
try {
  prisma = new PrismaClient();
} catch (error) {
  console.error('Failed to initialize Prisma:', error);
}

const defaultArticles = [
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

我并不拘泥于传统的编程范式，而是善于利用 AI 工具作为我的"副驾驶"。这极大地缩短了从"想法"到"产品"的距离。

这不仅仅是工具的堆砌，更是我对教育事业热爱的另一种极具创造力的表达方式。

未来，我还会在这里分享更多关于**英语教学法**、**AI 辅助教学**以及 **Web 开发**的思考与实践。感谢你的访问，希望这些工具能给你带来启发！`,
    date: new Date().toISOString().split('T')[0],
    imageUrl: 'https://p.ipic.vip/198jan.jpg',
    tags: ['教学思考', 'AI'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const defaultApps = [
  {
    id: 'writeascend',
    title: 'Write Ascend',
    description: 'AI 驱动的英语作文智能批改系统，支持多维度评分与年级难度控制。',
    url: 'https://writeascend.newsunenglish.com/',
    category: '智能教学辅助',
    tags: ['AI', '教学工具'],
    iconName: 'Code',
    imageUrl: 'https://p.ipic.vip/ppvs3g.jpg',
    isPrivate: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'vocab',
    title: 'Vocab System',
    description: '支持 Excel 一键导入的词汇管理与训练系统，提升学生单词记忆效率。',
    url: 'https://vocab-system.newsunenglish.com/',
    category: '智能教学辅助',
    tags: ['数据驱动', '效率'],
    iconName: 'GraduationCap',
    imageUrl: 'https://p.ipic.vip/gwurf7.jpg',
    isPrivate: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'passage',
    title: 'Passage Editing',
    description: '智能语篇编辑工具，为英语阅读和改错提供数字化辅助。',
    url: 'https://passage-editing.newsunenglish.com/',
    category: '智能教学辅助',
    tags: ['阅读', '工具'],
    iconName: 'Layout',
    imageUrl: 'https://p.ipic.vip/js32gc.jpg',
    isPrivate: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'schulte',
    title: 'Schulte Grid',
    description: '舒尔特方格注意力训练工具，通过趣味交互提升学生专注力。',
    url: 'https://schultegrid.newsunenglish.com/',
    category: '智能教学辅助',
    tags: ['专注力', '游戏化'],
    iconName: 'Layout',
    imageUrl: 'https://p.ipic.vip/ls9q8u.jpg',
    isPrivate: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'teaching-plan',
    title: '智能备课',
    description: '三学联网智能备课系统，面向专业教育场景的备课辅助平台。',
    url: 'https://teaching-plan.newsunenglish.com/',
    category: '智能教学辅助',
    tags: ['备课', 'AI'],
    iconName: 'GraduationCap',
    imageUrl: 'https://p.ipic.vip/jexpu6.jpg',
    isPrivate: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prompthub',
    title: 'PromptHub',
    description: 'AI 提示词共享平台，发现、分享、复用优质提示词，提升教学与办公效率。',
    url: 'https://promt.newsunenglish.com/',
    category: '智能教学辅助',
    tags: ['提示词', '社区'],
    iconName: 'Sparkles',
    imageUrl: 'https://p.ipic.vip/ja8ayx.jpg',
    isPrivate: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ems',
    title: 'EMS 数据中心',
    description: '数字化排考系统，自动化管理学年、学期、考试场次与学科安排。',
    url: 'https://ems.newsunenglish.com/',
    category: '教务与管理',
    tags: ['教务', '管理系统'],
    iconName: 'Globe',
    imageUrl: 'https://p.ipic.vip/t6g69n.jpg',
    isPrivate: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'teaching',
    title: '初中教学常规查询',
    description: '汇集最新版各学科教学常规与管理指引，方便快速查询。',
    url: 'https://teaching.newsunenglish.com/',
    category: '教务与管理',
    tags: ['规范', '查询'],
    iconName: 'Layout',
    imageUrl: 'https://p.ipic.vip/u7kolm.jpg',
    isPrivate: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'monthlysum',
    title: '月度自评生成器',
    description: '内部访问验证后快速生成月度自评内容，提升教务总结效率。',
    url: 'https://monthlysum.newsunenglish.com/',
    category: '教务与管理',
    tags: ['教务', '月度总结'],
    iconName: 'Layout',
    imageUrl: 'https://p.ipic.vip/xtxtv3.jpg',
    isPrivate: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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
    isPrivate: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'display02',
    title: 'Display 02',
    description: '前端交互与创意展示网页 02。',
    url: 'https://display2.newsunenglish.com/',
    category: '综合展示',
    tags: ['前端', 'UI/UX'],
    iconName: 'Layout',
    imageUrl: 'https://p.ipic.vip/b74x3r.jpg',
    isPrivate: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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
    isPrivate: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  if (!prisma) {
    return res.status(503).json({ message: 'Database service unavailable' });
  }

  try {
    // 清空现有数据
    console.log('Clearing existing data...');
    await prisma.article.deleteMany({});
    await prisma.appItem.deleteMany({});

    // 插入默认文章
    console.log('Inserting default articles...');
    for (const article of defaultArticles) {
      await prisma.article.create({ data: article });
    }

    // 插入默认应用
    console.log('Inserting default apps...');
    for (const app of defaultApps) {
      await prisma.appItem.create({ data: app });
    }

    res.json({
      message: 'Default data restored successfully',
      articles: defaultArticles.length,
      apps: defaultApps.length
    });
  } catch (error) {
    console.error('Error restoring default data:', error);
    res.status(500).json({
      message: 'Failed to restore default data',
      error: error.message
    });
  }
}
