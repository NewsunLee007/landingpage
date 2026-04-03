import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import type { AppItem, Article } from '../store/useStore';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Edit2, Save, LogOut } from 'lucide-react';
import { apiService } from '../services/api';
import { Helmet } from 'react-helmet-async';

function checkAuth(): boolean {
  return !!localStorage.getItem('newsun_auth_token');
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(checkAuth);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [backendAvailable, setBackendAvailable] = useState(false);

  const { apps, articles, addApp, updateApp, deleteApp, addArticle, updateArticle, deleteArticle, setApps, setArticles } = useStore();
  const [activeTab, setActiveTab] = useState<'apps' | 'articles'>('apps');

  const [isEditingApp, setIsEditingApp] = useState(false);
  const [currentApp, setCurrentApp] = useState<Partial<AppItem>>({});

  const [isEditingArticle, setIsEditingArticle] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<Partial<Article>>({});

  useEffect(() => {
    const checkBackendAndLoadData = async () => {
      if (isAuthenticated) {
        try {
          const isAvailable = await apiService.isBackendAvailable();
          setBackendAvailable(isAvailable);
          
          if (isAvailable) {
            // 从后端加载数据
            const [appsData, articlesData] = await Promise.all([
              apiService.getApps(),
              apiService.getArticles()
            ]);
            setApps(appsData as AppItem[]);
            setArticles(articlesData as Article[]);
          }
        } catch (error) {
          console.error('检查后端状态失败:', error);
          setBackendAvailable(false);
        }
      }
    };

    checkBackendAndLoadData();
  }, [isAuthenticated, setApps, setArticles]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 为了测试方便，添加一个简单的本地登录逻辑
      if (username === 'admin' && password === 'newsun2024') {
        localStorage.setItem('newsun_auth_token', 'test-token');
        setIsAuthenticated(true);
        setLoginError('');
      } else {
        // 尝试通过API登录
        await apiService.login(username, password);
        setIsAuthenticated(true);
        setLoginError('');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setLoginError('用户名或密码错误，请重试');
    }
  };

  const handleLogout = () => {
    apiService.logout();
    setIsAuthenticated(false);
  };

  const handleSaveApp = async () => {
    if (!currentApp.title || !currentApp.url) return;
    
    try {
      if (currentApp.id) {
        await apiService.updateApp(currentApp.id, currentApp as any);
        updateApp(currentApp.id, currentApp as AppItem);
      } else {
        const newApp = {
          ...currentApp,
          tags: currentApp.tags || ['新增工具'],
          iconName: currentApp.iconName || 'Layout',
          category: currentApp.category || '综合展示',
        } as any;
        const createdApp = await apiService.createApp(newApp);
        addApp(createdApp as AppItem);
      }
      setIsEditingApp(false);
      setCurrentApp({});
    } catch (error) {
      console.error('保存应用失败:', error);
      alert('保存失败，请稍后重试');
    }
  };

  const handleSaveArticle = async () => {
    if (!currentArticle.title || !currentArticle.content) return;
    
    try {
      if (currentArticle.id) {
        await apiService.updateArticle(currentArticle.id, currentArticle as any);
        updateArticle(currentArticle.id, currentArticle as Article);
      } else {
        const newArticle = {
          ...currentArticle,
          date: new Date().toISOString().split('T')[0],
        } as any;
        const createdArticle = await apiService.createArticle(newArticle);
        addArticle(createdArticle as Article);
      }
      setIsEditingArticle(false);
      setCurrentArticle({});
    } catch (error) {
      console.error('保存文章失败:', error);
      alert('保存失败，请稍后重试');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0F0F0F] flex items-center justify-center p-6 font-sans">
        <Helmet>
          <title>管理后台 - Newsun</title>
        </Helmet>
        <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.05)] w-full max-w-md border border-stone-100 dark:bg-[#1A1A1A] dark:border-stone-800 dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.3)]">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-stone-800 font-serif mb-2 dark:text-stone-100">Newsun 控制台</h1>
            <p className="text-stone-500 text-sm dark:text-stone-400">请输入管理密码以继续</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input 
                type="text" 
                placeholder="用户名" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-[#2A6049] focus:ring-1 focus:ring-[#2A6049] outline-none transition-all dark:bg-stone-800 dark:border-stone-700 dark:text-stone-200 dark:placeholder:text-stone-500 dark:focus:border-[#4A8069] dark:focus:ring-[#4A8069]"
              />
            </div>
            <div>
              <input 
                type="password" 
                placeholder="管理密码" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-[#2A6049] focus:ring-1 focus:ring-[#2A6049] outline-none transition-all dark:bg-stone-800 dark:border-stone-700 dark:text-stone-200 dark:placeholder:text-stone-500 dark:focus:border-[#4A8069] dark:focus:ring-[#4A8069]"
              />
            </div>
            {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
            <button 
              type="submit"
              className="w-full py-3 bg-[#2A6049] text-white rounded-xl font-medium hover:bg-[#1f4736] transition-colors dark:bg-[#4A8069] dark:hover:bg-[#3d6d58]"
            >
              登录
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200">返回首页</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-stone-800 font-sans dark:bg-[#0F0F0F] dark:text-stone-200">
      <Helmet>
        <title>管理后台 - Newsun</title>
      </Helmet>

      <nav className="bg-white border-b border-stone-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10 dark:bg-[#0F0F0F] dark:border-stone-800">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 hover:bg-stone-50 rounded-full transition-colors text-stone-500 dark:hover:bg-stone-800 dark:text-stone-400">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold font-serif">Newsun 控制台</h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('apps')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === 'apps' ? 'bg-[#2A6049] text-white dark:bg-[#4A8069]' : 'bg-stone-50 text-stone-600 hover:bg-stone-100 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700'}`}
            >
              应用管理
            </button>
            <button 
              onClick={() => setActiveTab('articles')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === 'articles' ? 'bg-[#2A6049] text-white dark:bg-[#4A8069]' : 'bg-stone-50 text-stone-600 hover:bg-stone-100 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700'}`}
            >
              随笔发布
            </button>
          </div>
          <button onClick={handleLogout} className="text-stone-400 hover:text-stone-800 transition-colors dark:text-stone-500 dark:hover:text-stone-200">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-6 mt-6">
        
        {/* Backend API Status Banner */}
        {!backendAvailable && (
          <div className="mb-8 p-4 bg-orange-50 border border-orange-200 text-orange-800 rounded-2xl text-sm dark:bg-orange-900/20 dark:border-orange-800/50 dark:text-orange-300">
            <strong>后端服务未连接提示：</strong> 当前数据保存在您的浏览器本地。若需使用后端 API 保存数据，请确保后端服务已启动并正常运行。
          </div>
        )}

        {activeTab === 'apps' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold font-serif">工具矩阵管理</h2>
              <button 
                onClick={() => { setCurrentApp({}); setIsEditingApp(true); }}
                className="flex items-center gap-2 bg-[#2A6049] text-white px-5 py-2.5 rounded-xl hover:bg-[#1f4736] transition-colors text-sm font-medium shadow-sm dark:bg-[#4A8069] dark:hover:bg-[#3d6d58]"
              >
                <Plus className="w-4 h-4" /> 添加工具
              </button>
            </div>

            {isEditingApp && (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 mb-6 dark:bg-[#1A1A1A] dark:border-stone-800">
                <h3 className="text-lg font-bold mb-6 font-serif">{currentApp.id ? '编辑工具' : '新增工具'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2 dark:text-stone-300">应用名称</label>
                    <input type="text" value={currentApp.title || ''} onChange={e => setCurrentApp({...currentApp, title: e.target.value})} className="w-full border border-stone-200 rounded-xl px-4 py-2.5 focus:ring-1 focus:ring-[#2A6049] outline-none transition-all dark:bg-stone-800 dark:border-stone-700 dark:text-stone-200 dark:focus:ring-[#4A8069]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2 dark:text-stone-300">URL 链接</label>
                    <input type="text" value={currentApp.url || ''} onChange={e => setCurrentApp({...currentApp, url: e.target.value})} className="w-full border border-stone-200 rounded-xl px-4 py-2.5 focus:ring-1 focus:ring-[#2A6049] outline-none transition-all dark:bg-stone-800 dark:border-stone-700 dark:text-stone-200 dark:focus:ring-[#4A8069]" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-stone-700 mb-2 dark:text-stone-300">简介描述</label>
                    <input type="text" value={currentApp.description || ''} onChange={e => setCurrentApp({...currentApp, description: e.target.value})} className="w-full border border-stone-200 rounded-xl px-4 py-2.5 focus:ring-1 focus:ring-[#2A6049] outline-none transition-all dark:bg-stone-800 dark:border-stone-700 dark:text-stone-200 dark:focus:ring-[#4A8069]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2 dark:text-stone-300">图标类型</label>
                    <select value={currentApp.iconName || 'Layout'} onChange={e => setCurrentApp({...currentApp, iconName: e.target.value})} className="w-full border border-stone-200 rounded-xl px-4 py-2.5 focus:ring-1 focus:ring-[#2A6049] outline-none transition-all bg-white dark:bg-stone-800 dark:border-stone-700 dark:text-stone-200 dark:focus:ring-[#4A8069]">
                      <option value="Layout">布局/工具 (Layout)</option>
                      <option value="Code">代码/开发 (Code)</option>
                      <option value="GraduationCap">教育/学习 (Cap)</option>
                      <option value="Globe">地球/网络 (Globe)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2 dark:text-stone-300">图片链接 (可选)</label>
                    <input type="text" value={currentApp.imageUrl || ''} onChange={e => setCurrentApp({...currentApp, imageUrl: e.target.value})} className="w-full border border-stone-200 rounded-xl px-4 py-2.5 focus:ring-1 focus:ring-[#2A6049] outline-none transition-all dark:bg-stone-800 dark:border-stone-700 dark:text-stone-200 dark:focus:ring-[#4A8069]" placeholder="例如: https://p.ipic.vip/ppvs3g.jpg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2 dark:text-stone-300">分类</label>
                    <select value={currentApp.category || '综合展示'} onChange={e => setCurrentApp({...currentApp, category: e.target.value})} className="w-full border border-stone-200 rounded-xl px-4 py-2.5 focus:ring-1 focus:ring-[#2A6049] outline-none transition-all bg-white dark:bg-stone-800 dark:border-stone-700 dark:text-stone-200 dark:focus:ring-[#4A8069]">
                      <option value="智能教学辅助">智能教学辅助</option>
                      <option value="教务与管理">教务与管理</option>
                      <option value="综合展示">综合展示</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2 dark:text-stone-300">标签（逗号分隔）</label>
                    <input type="text" value={currentApp.tags?.join(', ') || ''} onChange={e => setCurrentApp({...currentApp, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)})} className="w-full border border-stone-200 rounded-xl px-4 py-2.5 focus:ring-1 focus:ring-[#2A6049] outline-none transition-all dark:bg-stone-800 dark:border-stone-700 dark:text-stone-200 dark:focus:ring-[#4A8069]" placeholder="例如: AI, 教学工具" />
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <button onClick={() => setIsEditingApp(false)} className="px-6 py-2.5 border border-stone-200 text-stone-600 rounded-xl hover:bg-stone-50 font-medium text-sm transition-colors dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-800">取消</button>
                  <button onClick={handleSaveApp} className="px-6 py-2.5 bg-[#2A6049] text-white rounded-xl hover:bg-[#1f4736] flex items-center gap-2 font-medium text-sm transition-colors shadow-sm dark:bg-[#4A8069] dark:hover:bg-[#3d6d58]">
                    <Save className="w-4 h-4" /> 保存
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden dark:bg-[#1A1A1A] dark:border-stone-800">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50/50 border-b border-stone-100 text-stone-500 text-sm font-medium dark:bg-stone-900/50 dark:border-stone-800 dark:text-stone-400">
                    <th className="p-5">应用名称</th>
                    <th className="p-5 hidden md:table-cell">描述</th>
                    <th className="p-5 text-right">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {apps.map(app => (
                    <tr key={app.id} className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors dark:border-stone-800 dark:hover:bg-stone-900/50">
                      <td className="p-5 font-medium text-stone-800 dark:text-stone-100">{app.title}</td>
                      <td className="p-5 text-stone-500 text-sm hidden md:table-cell truncate max-w-xs dark:text-stone-400">{app.description}</td>
                      <td className="p-5 flex justify-end gap-2">
                        <button onClick={() => { setCurrentApp(app); setIsEditingApp(true); }} className="p-2.5 text-stone-400 hover:text-[#2A6049] hover:bg-[#E8F0EE] rounded-xl transition-colors dark:text-stone-500 dark:hover:text-[#4A8069] dark:hover:bg-[#1a2e24]">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={async () => {
                          if (window.confirm('确定要删除这个应用吗？')) {
                            try {
                              await apiService.deleteApp(app.id);
                              deleteApp(app.id);
                            } catch (error) {
                              console.error('删除应用失败:', error);
                              alert('删除失败，请稍后重试');
                            }
                          }
                        }} className="p-2.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors dark:text-stone-500 dark:hover:text-red-400 dark:hover:bg-red-900/20">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'articles' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold font-serif">随笔与动态</h2>
              <button 
                onClick={() => { setCurrentArticle({}); setIsEditingArticle(true); }}
                className="flex items-center gap-2 bg-[#2A6049] text-white px-5 py-2.5 rounded-xl hover:bg-[#1f4736] transition-colors text-sm font-medium shadow-sm dark:bg-[#4A8069] dark:hover:bg-[#3d6d58]"
              >
                <Plus className="w-4 h-4" /> 撰写新随笔
              </button>
            </div>

            {isEditingArticle && (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 mb-6 dark:bg-[#1A1A1A] dark:border-stone-800">
                <h3 className="text-lg font-bold mb-6 font-serif">{currentArticle.id ? '编辑随笔' : '撰写新随笔'}</h3>
                <div className="space-y-5 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2 dark:text-stone-300">标题</label>
                    <input type="text" value={currentArticle.title || ''} onChange={e => setCurrentArticle({...currentArticle, title: e.target.value})} className="w-full border border-stone-200 rounded-xl px-4 py-2.5 focus:ring-1 focus:ring-[#2A6049] outline-none transition-all dark:bg-stone-800 dark:border-stone-700 dark:text-stone-200 dark:focus:ring-[#4A8069]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2 dark:text-stone-300">摘要 (展示在首页列表)</label>
                    <textarea rows={2} value={currentArticle.summary || ''} onChange={e => setCurrentArticle({...currentArticle, summary: e.target.value})} className="w-full border border-stone-200 rounded-xl px-4 py-2.5 focus:ring-1 focus:ring-[#2A6049] outline-none transition-all resize-none dark:bg-stone-800 dark:border-stone-700 dark:text-stone-200 dark:focus:ring-[#4A8069]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2 dark:text-stone-300">标签（逗号分隔，可选）</label>
                    <input type="text" value={currentArticle.tags?.join(', ') || ''} onChange={e => setCurrentArticle({...currentArticle, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)})} className="w-full border border-stone-200 rounded-xl px-4 py-2.5 focus:ring-1 focus:ring-[#2A6049] outline-none transition-all dark:bg-stone-800 dark:border-stone-700 dark:text-stone-200 dark:focus:ring-[#4A8069]" placeholder="例如: 教学思考, AI" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2 dark:text-stone-300">图片链接 (可选)</label>
                    <input type="text" value={currentArticle.imageUrl || ''} onChange={e => setCurrentArticle({...currentArticle, imageUrl: e.target.value})} className="w-full border border-stone-200 rounded-xl px-4 py-2.5 focus:ring-1 focus:ring-[#2A6049] outline-none transition-all dark:bg-stone-800 dark:border-stone-700 dark:text-stone-200 dark:focus:ring-[#4A8069]" placeholder="例如: https://p.ipic.vip/198jan.jpg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2 dark:text-stone-300">正文内容</label>
                    <textarea rows={6} value={currentArticle.content || ''} onChange={e => setCurrentArticle({...currentArticle, content: e.target.value})} className="w-full border border-stone-200 rounded-xl px-4 py-2.5 focus:ring-1 focus:ring-[#2A6049] outline-none transition-all resize-none dark:bg-stone-800 dark:border-stone-700 dark:text-stone-200 dark:focus:ring-[#4A8069]" />
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <button onClick={() => setIsEditingArticle(false)} className="px-6 py-2.5 border border-stone-200 text-stone-600 rounded-xl hover:bg-stone-50 font-medium text-sm transition-colors dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-800">取消</button>
                  <button onClick={handleSaveArticle} className="px-6 py-2.5 bg-[#2A6049] text-white rounded-xl hover:bg-[#1f4736] flex items-center gap-2 font-medium text-sm transition-colors shadow-sm dark:bg-[#4A8069] dark:hover:bg-[#3d6d58]">
                    <Save className="w-4 h-4" /> {currentArticle.id ? '更新' : '发布'}
                  </button>
                </div>
              </div>
            )}

            <div className="grid gap-4">
              {articles.map(article => (
                <div key={article.id} className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 flex justify-between items-start group hover:border-[#E8F0EE] transition-colors dark:bg-[#1A1A1A] dark:border-stone-800 dark:hover:border-[#1a2e24]">
                  <div>
                    <div className="text-sm text-stone-400 font-mono mb-2 dark:text-stone-500">{article.date}</div>
                    <h3 className="text-lg font-bold text-stone-800 mb-2 font-serif dark:text-stone-100">{article.title}</h3>
                    <p className="text-stone-500 text-sm dark:text-stone-400">{article.summary}</p>
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex gap-1.5 mt-2 flex-wrap">
                        {article.tags.map(tag => (
                          <span key={tag} className="text-[11px] px-2.5 py-0.5 rounded-full bg-stone-50 text-stone-500 border border-stone-100/50 dark:bg-stone-800 dark:text-stone-400 dark:border-stone-700/50">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => { setCurrentArticle(article); setIsEditingArticle(true); }} className="p-2.5 text-stone-400 hover:text-[#2A6049] hover:bg-[#E8F0EE] rounded-xl transition-colors dark:text-stone-500 dark:hover:text-[#4A8069] dark:hover:bg-[#1a2e24]">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={async () => {
                      if (window.confirm('确定要删除这篇文章吗？')) {
                        try {
                          await apiService.deleteArticle(article.id);
                          deleteArticle(article.id);
                        } catch (error) {
                          console.error('删除文章失败:', error);
                          alert('删除失败，请稍后重试');
                        }
                      }
                    }} className="p-2.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors dark:text-stone-500 dark:hover:text-red-400 dark:hover:bg-red-900/20">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
