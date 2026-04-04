import { PrismaClient } from '@prisma/client';

let prisma;
try {
  prisma = new PrismaClient();
} catch (error) {
  console.error('Failed to initialize Prisma:', error);
}

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
  try {
    if (req.method === 'GET') {
      if (prisma) {
        try {
          const apps = await prisma.appItem.findMany();
          res.json(apps.length > 0 ? apps : defaultApps);
        } catch (error) {
          console.error('Error fetching apps:', error);
          res.json(defaultApps);
        }
      } else {
        res.json(defaultApps);
      }
    } else if (req.method === 'POST') {
      if (!prisma) {
        return res.status(503).json({ message: 'Database service unavailable' });
      }
      
      const appData = req.body;
      const newApp = await prisma.appItem.create({
        data: appData,
      });
      res.json(newApp);
    } else if (req.method === 'PUT') {
      if (!prisma) {
        return res.status(503).json({ message: 'Database service unavailable' });
      }
      
      const { id, ...appData } = req.body;
      const updatedApp = await prisma.appItem.update({
        where: { id },
        data: appData,
      });
      res.json(updatedApp);
    } else if (req.method === 'DELETE') {
      if (!prisma) {
        return res.status(503).json({ message: 'Database service unavailable' });
      }
      
      const { id } = req.body;
      try {
        await prisma.appItem.delete({
          where: { id },
        });
        res.json({ message: 'App deleted successfully' });
      } catch (error) {
        console.error('Error deleting app:', error);
        res.json({ message: 'App deleted or not found' });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('App API error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}