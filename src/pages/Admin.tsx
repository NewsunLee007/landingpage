import { useState } from 'react';
import { useStore } from '../store/useStore';
import type { AppItem, Article } from '../store/useStore';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Edit2, Save, LogOut } from 'lucide-react';
import { isDbConfigured } from '../services/db';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('newsun_admin_auth') === 'true');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const { apps, articles, addApp, updateApp, deleteApp, addArticle, deleteArticle } = useStore();
  const [activeTab, setActiveTab] = useState<'apps' | 'articles'>('apps');

  const [isEditingApp, setIsEditingApp] = useState(false);
  const [currentApp, setCurrentApp] = useState<Partial<AppItem>>({});

  const [isEditingArticle, setIsEditingArticle] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<Partial<Article>>({});

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // 这里为了演示提供一个简单的硬编码密码，后续您可以改为 LeanCloud 验证
    if (password === 'newsun2024') {
      setIsAuthenticated(true);
      localStorage.setItem('newsun_admin_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('密码错误，请重试');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('newsun_admin_auth');
  };

  const handleSaveApp = () => {
    if (!currentApp.title || !currentApp.url) return;
    
    if (currentApp.id) {
      updateApp(currentApp.id, currentApp as AppItem);
    } else {
      addApp({
        ...currentApp,
        id: Date.now().toString(),
        tags: currentApp.tags || ['新增工具'],
        iconName: currentApp.iconName || 'Layout',
        category: currentApp.category || '综合展示',
      } as AppItem);
    }
    setIsEditingApp(false);
    setCurrentApp({});
  };

  const handleSaveArticle = () => {
    if (!currentArticle.title || !currentArticle.content) return;
    
    if (!currentArticle.id) {
      addArticle({
        ...currentArticle,
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
      } as Article);
    }
    setIsEditingArticle(false);
    setCurrentArticle({});
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6 font-sans">
        <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.05)] w-full max-w-md border border-stone-100">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-stone-800 font-serif mb-2">Newsun 控制台</h1>
            <p className="text-stone-500 text-sm">请输入管理密码以继续</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input 
                type="password" 
                placeholder="管理密码 (默认: newsun2024)" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-[#2A6049] focus:ring-1 focus:ring-[#2A6049] outline-none transition-all"
              />
            </div>
            {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
            <button 
              type="submit"
              className="w-full py-3 bg-[#2A6049] text-white rounded-xl font-medium hover:bg-[#1f4736] transition-colors"
            >
              登录
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-stone-500 hover:text-stone-800">返回首页</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-stone-800 font-sans">
      <nav className="bg-white border-b border-stone-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 hover:bg-stone-50 rounded-full transition-colors text-stone-500">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold font-serif">Newsun 控制台</h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('apps')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === 'apps' ? 'bg-[#2A6049] text-white' : 'bg-stone-50 text-stone-600 hover:bg-stone-100'}`}
            >
              应用管理
            </button>
            <button 
              onClick={() => setActiveTab('articles')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === 'articles' ? 'bg-[#2A6049] text-white' : 'bg-stone-50 text-stone-600 hover:bg-stone-100'}`}
            >
              随笔发布
            </button>
          </div>
          <button onClick={handleLogout} className="text-stone-400 hover:text-stone-800 transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-6 mt-6">
        
        {/* LeanCloud Status Banner */}
        {!isDbConfigured && (
          <div className="mb-8 p-4 bg-orange-50 border border-orange-200 text-orange-800 rounded-2xl text-sm">
            <strong>数据库未配置提示：</strong> 当前数据保存在您的浏览器本地。若需在正式外网环境长期保存，请在代码 <code>.env.local</code> 文件中配置您的 <strong>LeanCloud</strong> 密钥 (APP_ID / APP_KEY)。由于国内网络环境限制，推荐使用 LeanCloud 或 Laf 作为轻量级云开发数据库。
          </div>
        )}

        {activeTab === 'apps' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold font-serif">工具矩阵管理</h2>
              <button 
                onClick={() => { setCurrentApp({}); setIsEditingApp(true); }}
                className="flex items-center gap-2 bg-[#2A6049] text-white px-5 py-2.5 rounded-xl hover:bg-[#1f4736] transition-colors text-sm font-medium shadow-sm"
              >
                <Plus className="w-4 h-4" /> 添加工具
              </button>
            </div>

            {isEditingApp && (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 mb-6">
                <h3 className="text-lg font-bold mb-6 font-serif">{currentApp.id ? '编辑工具' : '新增工具'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">应用名称</label>
                    <input type="text" value={currentApp.title || ''} onChange={e => setCurrentApp({...currentApp, title: e.target.value})} className="w-full border border-stone-200 rounded-xl px-4 py-2.5 focus:ring-1 focus:ring-[#2A6049] outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">URL 链接</label>
                    <input type="text" value={currentApp.url || ''} onChange={e => setCurrentApp({...currentApp, url: e.target.value})} className="w-full border border-stone-200 rounded-xl px-4 py-2.5 focus:ring-1 focus:ring-[#2A6049] outline-none transition-all" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-stone-700 mb-2">简介描述</label>
                    <input type="text" value={currentApp.description || ''} onChange={e => setCurrentApp({...currentApp, description: e.target.value})} className="w-full border border-stone-200 rounded-xl px-4 py-2.5 focus:ring-1 focus:ring-[#2A6049] outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">图标类型</label>
                    <select value={currentApp.iconName || 'Layout'} onChange={e => setCurrentApp({...currentApp, iconName: e.target.value})} className="w-full border border-stone-200 rounded-xl px-4 py-2.5 focus:ring-1 focus:ring-[#2A6049] outline-none transition-all bg-white">
                      <option value="Layout">布局/工具 (Layout)</option>
                      <option value="Code">代码/开发 (Code)</option>
                      <option value="GraduationCap">教育/学习 (Cap)</option>
                      <option value="Globe">地球/网络 (Globe)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">图片链接 (可选)</label>
                    <input type="text" value={currentApp.imageUrl || ''} onChange={e => setCurrentApp({...currentApp, imageUrl: e.target.value})} className="w-full border border-stone-200 rounded-xl px-4 py-2.5 focus:ring-1 focus:ring-[#2A6049] outline-none transition-all" placeholder="例如: https://p.ipic.vip/ppvs3g.jpg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">图片链接 (可选)</label>
                    <input type="text" value={currentArticle.imageUrl || ''} onChange={e => setCurrentArticle({...currentArticle, imageUrl: e.target.value})} className="w-full border border-stone-200 rounded-xl px-4 py-2.5 focus:ring-1 focus:ring-[#2A6049] outline-none transition-all" placeholder="例如: https://p.ipic.vip/198jan.jpg" />
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <button onClick={() => setIsEditingApp(false)} className="px-6 py-2.5 border border-stone-200 text-stone-600 rounded-xl hover:bg-stone-50 font-medium text-sm transition-colors">取消</button>
                  <button onClick={handleSaveApp} className="px-6 py-2.5 bg-[#2A6049] text-white rounded-xl hover:bg-[#1f4736] flex items-center gap-2 font-medium text-sm transition-colors shadow-sm">
                    <Save className="w-4 h-4" /> 保存
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50/50 border-b border-stone-100 text-stone-500 text-sm font-medium">
                    <th className="p-5">应用名称</th>
                    <th className="p-5 hidden md:table-cell">描述</th>
                    <th className="p-5 text-right">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {apps.map(app => (
                    <tr key={app.id} className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors">
                      <td className="p-5 font-medium text-stone-800">{app.title}</td>
                      <td className="p-5 text-stone-500 text-sm hidden md:table-cell truncate max-w-xs">{app.description}</td>
                      <td className="p-5 flex justify-end gap-2">
                        <button onClick={() => { setCurrentApp(app); setIsEditingApp(true); }} className="p-2.5 text-stone-400 hover:text-[#2A6049] hover:bg-[#E8F0EE] rounded-xl transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteApp(app.id)} className="p-2.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
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
                className="flex items-center gap-2 bg-[#2A6049] text-white px-5 py-2.5 rounded-xl hover:bg-[#1f4736] transition-colors text-sm font-medium shadow-sm"
              >
                <Plus className="w-4 h-4" /> 撰写新随笔
              </button>
            </div>

            {isEditingArticle && (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 mb-6">
                <h3 className="text-lg font-bold mb-6 font-serif">编辑随笔</h3>
                <div className="space-y-5 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">标题</label>
                    <input type="text" value={currentArticle.title || ''} onChange={e => setCurrentArticle({...currentArticle, title: e.target.value})} className="w-full border border-stone-200 rounded-xl px-4 py-2.5 focus:ring-1 focus:ring-[#2A6049] outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">摘要 (展示在首页列表)</label>
                    <textarea rows={2} value={currentArticle.summary || ''} onChange={e => setCurrentArticle({...currentArticle, summary: e.target.value})} className="w-full border border-stone-200 rounded-xl px-4 py-2.5 focus:ring-1 focus:ring-[#2A6049] outline-none transition-all resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">图片链接 (可选)</label>
                    <input type="text" value={currentArticle.imageUrl || ''} onChange={e => setCurrentArticle({...currentArticle, imageUrl: e.target.value})} className="w-full border border-stone-200 rounded-xl px-4 py-2.5 focus:ring-1 focus:ring-[#2A6049] outline-none transition-all" placeholder="例如: https://p.ipic.vip/198jan.jpg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">正文内容</label>
                    <textarea rows={6} value={currentArticle.content || ''} onChange={e => setCurrentArticle({...currentArticle, content: e.target.value})} className="w-full border border-stone-200 rounded-xl px-4 py-2.5 focus:ring-1 focus:ring-[#2A6049] outline-none transition-all resize-none" />
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <button onClick={() => setIsEditingArticle(false)} className="px-6 py-2.5 border border-stone-200 text-stone-600 rounded-xl hover:bg-stone-50 font-medium text-sm transition-colors">取消</button>
                  <button onClick={handleSaveArticle} className="px-6 py-2.5 bg-[#2A6049] text-white rounded-xl hover:bg-[#1f4736] flex items-center gap-2 font-medium text-sm transition-colors shadow-sm">
                    <Save className="w-4 h-4" /> 发布
                  </button>
                </div>
              </div>
            )}

            <div className="grid gap-4">
              {articles.map(article => (
                <div key={article.id} className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 flex justify-between items-start group hover:border-[#E8F0EE] transition-colors">
                  <div>
                    <div className="text-sm text-stone-400 font-mono mb-2">{article.date}</div>
                    <h3 className="text-lg font-bold text-stone-800 mb-2 font-serif">{article.title}</h3>
                    <p className="text-stone-500 text-sm">{article.summary}</p>
                  </div>
                  <button onClick={() => deleteArticle(article.id)} className="p-2.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
