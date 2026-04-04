# 🚀 Neon + Vercel 部署全指南

## 目录
- [第一步：准备 Neon 数据库](#第一步准备-neon-数据库)
- [第二步：在 Vercel 创建项目](#第二步在-vercel-创建项目)
- [第三步：配置环境变量](#第三步配置环境变量)
- [第四步：部署](#第四步部署)
- [第五步：初始化数据库](#第五步初始化数据库)
- [第六步：测试](#第六步测试)

---

## 第一步：准备 Neon 数据库

1. 登录 [Neon Console](https://console.neon.tech/)

2. 进入您的项目（免费）项目

3. 点击右上角的 **"Connect"** 按钮

4. 选择连接方式为 **"Prisma"**

5. 复制连接字符串，格式如下：
   ```
   postgresql://user:password@ep-something.region.aws.neon.tech/neondb?sslmode=require
   ```

6. 保存好这个连接字符串，稍后会用到！

---

## 第二步：在 Vercel 创建项目

1. 打开 [Vercel Dashboard](https://vercel.com/dashboard)

2. 点击 **"Add New"** → **"Project"**

3. 选择您的 GitHub 仓库：`NewsunLee007/landingpage`

4. 点击 **"Import"**

---

## 第三步：配置环境变量

在项目设置页面，向下滚动到 **"Environment Variables"** 部分：

### 需要添加的环境变量：

| 变量名 | 值 |
|--------|-----|
| `DATABASE_URL` | 从 Neon 复制的连接字符串 |
| `DIRECT_DATABASE_URL` | 同上（和 DATABASE_URL 一样） |
| `JWT_SECRET` | 输入一个随机字符串（比如：`my-super-secret-key-12345`） |
| `ADMIN_USERNAME` | `admin` |
| `ADMIN_PASSWORD` | `newsun2024` |

**重要**：添加环境变量时，确保选择 **"Development"、"Preview"、"Production"** 都勾选上！

---

## 第四步：部署

点击右下角的 **"Deploy"** 按钮！

等待几分钟，部署成功后您会看到：
```
✅ 恭喜！您的项目已部署成功！
```

复制您的域名，类似：`https://your-project.vercel.app`

---

## 第五步：初始化数据库

部署成功后，我们需要推送数据库表结构：

### 方法一：使用本地命令（推荐）

1. 在项目根目录创建 `.env` 文件（如果没有的话）：

```bash
# 复制 .env 文件内容
DATABASE_URL=这里填您的 Neon 连接字符串
DIRECT_DATABASE_URL=同上
JWT_SECRET=您的 JWT 密钥
```

2. 打开终端，运行：

```bash
cd /workspace
npm install
npm run db:push
```

看到类似输出说明成功：
```
Your database is now in sync with your schema.
```

### 方法二：直接访问初始化管理员

部署成功后，浏览器访问：
```
https://您的域名/api/auth/init
```

看到 `Admin user created successfully!

---

## 第六步：测试

1. 访问您的网站：`https://您的域名`

2. 进入管理后台：`https://您的域名/admin`

3. 使用以下账号登录：
   - 用户名：`admin`
   - 密码：`newsun2024`

4. 尝试创建一篇文章！

---

## 常见问题

### Q: 部署失败怎么办？
A: 检查 Vercel 的日志，看是否环境变量配置正确

### Q: 数据库连接失败？
A: 确认 Neon 连接字符串是否正确复制，确保 `sslmode=require` 不要漏掉

### Q: 忘记密码不对？
A: 访问 `/api/auth/init` 重新初始化管理员

---

## 🎉 完成！

恭喜！您现在拥有一个完整的带后端的个人主页了！
