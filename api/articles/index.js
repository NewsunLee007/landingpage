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

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      if (prisma) {
        try {
          const articles = await prisma.article.findMany({
            orderBy: { date: 'desc' },
          });
          res.json(articles.length > 0 ? articles : defaultArticles);
        } catch (error) {
          console.error('Error fetching articles:', error);
          res.json(defaultArticles);
        }
      } else {
        res.json(defaultArticles);
      }
    } else if (req.method === 'POST') {
      if (!prisma) {
        return res.status(503).json({ message: 'Database service unavailable' });
      }
      
      const articleData = req.body;
      const newArticle = await prisma.article.create({
        data: articleData,
      });
      res.json(newArticle);
    } else if (req.method === 'PUT') {
      if (!prisma) {
        return res.status(503).json({ message: 'Database service unavailable' });
      }
      
      const { id, ...articleData } = req.body;
      const updatedArticle = await prisma.article.update({
        where: { id },
        data: articleData,
      });
      res.json(updatedArticle);
    } else if (req.method === 'DELETE') {
      if (!prisma) {
        return res.status(503).json({ message: 'Database service unavailable' });
      }
      
      const { id } = req.body;
      try {
        await prisma.article.delete({
          where: { id },
        });
        res.json({ message: 'Article deleted successfully' });
      } catch (error) {
        console.error('Error deleting article:', error);
        res.json({ message: 'Article deleted or not found' });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Article API error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}