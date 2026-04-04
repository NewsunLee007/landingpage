import { prisma, prepareArticleData, serializeArticle, prepareAppItemData, serializeAppItem } from './prisma.js';
import type { Article, AppItem } from '@prisma/client';

async function main() {
  console.log('=== 开始测试 Prisma CRUD 操作 ===');

  // 1. 测试创建管理员用户
  console.log('\n1. 测试创建管理员用户...');
  const admin = await prisma.adminUser.create({
    data: {
      username: 'admin',
      password: 'hashed_password_here', // 在实际应用中应该使用 bcrypt 等库进行加密
    },
  });
  console.log('✅ 创建管理员用户成功:', admin.username);

  // 2. 测试创建文章
  console.log('\n2. 测试创建文章...');
  const articleData = prepareArticleData({
    id: 'test-article-1',
    title: '测试文章标题',
    content: '这是测试文章的内容...',
    date: '2026-04-01',
    summary: '这是测试文章的摘要',
    imageUrl: 'https://example.com/image.jpg',
    tags: ['测试', 'Prisma'],
  });
  const article = await prisma.article.create({ data: articleData });
  console.log('✅ 创建文章成功:', serializeArticle(article));

  // 3. 测试创建应用项目
  console.log('\n3. 测试创建应用项目...');
  const appItemData = prepareAppItemData({
    id: 'test-app-1',
    title: '测试应用',
    description: '这是测试应用的描述',
    url: 'https://example.com',
    category: '测试分类',
    tags: ['工具', '测试'],
    iconName: 'TestIcon',
    imageUrl: 'https://example.com/app-icon.jpg',
    isPrivate: false,
  });
  const appItem = await prisma.appItem.create({ data: appItemData });
  console.log('✅ 创建应用项目成功:', serializeAppItem(appItem));

  // 4. 测试查询所有文章
  console.log('\n4. 测试查询所有文章...');
  const articles = await prisma.article.findMany();
  console.log('✅ 查询到', articles.length, '篇文章:', articles.map((a: Article) => serializeArticle(a)));

  // 5. 测试查询所有应用项目
  console.log('\n5. 测试查询所有应用项目...');
  const appItems = await prisma.appItem.findMany();
  console.log('✅ 查询到', appItems.length, '个应用项目:', appItems.map((a: AppItem) => serializeAppItem(a)));

  // 6. 测试更新文章
  console.log('\n6. 测试更新文章...');
  const updatedArticleData = prepareArticleData({
    title: '更新后的测试文章标题',
    tags: ['测试', 'Prisma', '更新'],
  });
  const updatedArticle = await prisma.article.update({
    where: { id: 'test-article-1' },
    data: updatedArticleData,
  });
  console.log('✅ 更新文章成功:', serializeArticle(updatedArticle));

  // 7. 测试删除文章
  console.log('\n7. 测试删除文章...');
  await prisma.article.delete({ where: { id: 'test-article-1' } });
  console.log('✅ 删除文章成功');

  // 8. 测试删除应用项目
  console.log('\n8. 测试删除应用项目...');
  await prisma.appItem.delete({ where: { id: 'test-app-1' } });
  console.log('✅ 删除应用项目成功');

  // 9. 测试删除管理员用户
  console.log('\n9. 测试删除管理员用户...');
  await prisma.adminUser.delete({ where: { id: admin.id } });
  console.log('✅ 删除管理员用户成功');

  console.log('\n=== 所有测试完成！Prisma CRUD 操作正常工作 ===');
}

main()
  .catch((e) => {
    console.error('测试过程中发生错误:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
