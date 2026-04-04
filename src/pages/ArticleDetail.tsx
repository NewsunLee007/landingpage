import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Share2, Sparkles, ThumbsUp, MessageSquare } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useToastStore } from '../store/useToastStore';
import type { ApiComment } from '../services/api';
import { useState, useEffect, useMemo } from 'react';
import { apiService } from '../services/api';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { articles } = useStore();
  const { addToast } = useToastStore();
  
  const [comments, setComments] = useState<ApiComment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newComment, setNewComment] = useState<{
    author: string;
    email: string;
    content: string;
  }>({
    author: '',
    email: '',
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const article = articles.find(a => a.id === id);

  const isHtmlContent = useMemo(() => {
    if (!article) return false;
    const content = article.content;
    return /<[a-z][\s\S]*>/i.test(content) || /&lt;[a-z][\s\S]*&gt;/i.test(content);
  }, [article]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchComments();
    }
  }, [id]);

  const fetchComments = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const data = await apiService.getComments(id);
      setComments(data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      addToast('加载评论失败，请稍后重试', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.author || !newComment.content) return;
    
    setIsSubmitting(true);
    try {
      if (!id) throw new Error('Article ID not found');
      await apiService.createComment({
        articleId: id,
        ...newComment
      });
      setNewComment({ author: '', email: '', content: '' });
      setSubmitSuccess(true);
      fetchComments();
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to submit comment:', error);
      addToast('评论提交失败，请稍后重试', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      await apiService.likeComment(commentId);
      fetchComments();
    } catch (error) {
      console.error('Failed to like comment:', error);
    }
  };

  if (!article) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0F0F0F] flex flex-col items-center justify-center">
        <Helmet>
          <title>文章未找到 - Newsun</title>
        </Helmet>
        <h1 className="text-2xl font-serif text-stone-800 mb-4 dark:text-stone-100">未找到该文章</h1>
        <button onClick={() => navigate('/')} className="text-[#2A6049] hover:underline flex items-center dark:text-[#4A8069]">
          <ArrowLeft className="w-4 h-4 mr-2" /> 返回首页
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-stone-800 font-sans selection:bg-[#E8F0EE] selection:text-[#2A6049] dark:bg-[#0F0F0F] dark:text-stone-200 dark:selection:bg-[#1a2e24] dark:selection:text-[#4A8069]">
      <Helmet>
        <title>{article.title} - Newsun</title>
      </Helmet>

      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/60 backdrop-blur-2xl border-b border-stone-200/50 shadow-[0_4px_30px_-10px_rgba(0,0,0,0.05)] transition-all duration-300 dark:bg-[#0F0F0F]/60 dark:border-stone-800/50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex items-center h-20">
            <Link to="/" className="group flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors dark:text-stone-400 dark:hover:text-stone-100">
              <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center group-hover:bg-[#E8F0EE] group-hover:text-[#2A6049] transition-colors dark:bg-stone-800 dark:group-hover:bg-[#1a2e24] dark:group-hover:text-[#4A8069]">
                <ArrowLeft className="w-4 h-4" />
              </div>
              <span className="font-medium text-sm">返回首页</span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-6 lg:px-8 max-w-6xl mx-auto relative z-10">
        <motion.article 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-[2.5rem] p-8 md:p-16 lg:p-24 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] border border-stone-100 relative overflow-hidden dark:bg-[#1A1A1A] dark:border-stone-800 dark:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.3)]"
        >
          {/* Decorative Background inside article */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#E8F0EE]/40 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/3 dark:bg-[#1a2e24]/30"></div>

          <header className="mb-12 relative z-10 text-center">
            <div className="flex items-center justify-center gap-4 text-stone-400 text-sm font-mono mb-8 dark:text-stone-500">
              <span className="flex items-center gap-1.5 bg-stone-50 px-3 py-1.5 rounded-full border border-stone-100 dark:bg-stone-800 dark:border-stone-700">
                <Calendar className="w-3.5 h-3.5" />
                {article.date}
              </span>
              <span className="flex items-center gap-1.5 bg-stone-50 px-3 py-1.5 rounded-full border border-stone-100 dark:bg-stone-800 dark:border-stone-700">
                <Sparkles className="w-3.5 h-3.5 text-[#2A6049] dark:text-[#4A8069]" />
                Newsun 随笔
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-stone-800 mb-8 font-serif leading-tight dark:text-stone-100">
              {article.title}
            </h1>
            
            <p className="text-xl text-stone-500 font-light leading-relaxed max-w-2xl mx-auto dark:text-stone-400">
              {article.summary}
            </p>
          </header>

          {article.imageUrl && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="w-full h-[400px] md:h-[500px] rounded-[2rem] overflow-hidden mb-16 relative z-10 shadow-lg"
            >
              <img 
                src={article.imageUrl} 
                alt={article.title} 
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}

          <div className="prose prose-stone prose-lg md:prose-xl max-w-none relative z-10 
            prose-headings:font-serif prose-headings:text-stone-800 dark:prose-headings:text-stone-100
            prose-p:text-stone-600 prose-p:font-light prose-p:leading-loose dark:prose-p:text-stone-300
            prose-a:text-[#2A6049] prose-a:no-underline hover:prose-a:underline dark:prose-a:text-[#4A8069]
            prose-blockquote:border-l-[#2A6049] prose-blockquote:bg-stone-50 prose-blockquote:py-2 prose-blockquote:pr-4 prose-blockquote:rounded-r-2xl prose-blockquote:not-italic prose-blockquote:text-stone-500 dark:prose-blockquote:bg-stone-800 dark:prose-blockquote:text-stone-400
            prose-img:rounded-[2rem] prose-img:shadow-md
            prose-li:text-stone-600 dark:prose-li:text-stone-300
            prose-strong:text-stone-800 dark:prose-strong:text-stone-100
            prose-code:bg-stone-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-stone-700 dark:prose-code:bg-stone-800 dark:prose-code:text-stone-300
            prose-pre:bg-stone-100 prose-pre:p-4 prose-pre:rounded-xl dark:prose-pre:bg-stone-800"
          >
            {isHtmlContent ? (
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            ) : (
              <ReactMarkdown>{article.content}</ReactMarkdown>
            )}
          </div>

          <footer className="mt-20 pt-10 border-t border-stone-100 relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 dark:border-stone-800">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2A6049] to-[#4A8069] flex items-center justify-center text-white font-serif font-bold text-xl shadow-md">
                N
              </div>
              <div>
                <div className="font-bold text-stone-800 font-serif dark:text-stone-100">Newsun Lee</div>
                <div className="text-sm text-stone-500 font-light dark:text-stone-400">English Educator & Vibe Coder</div>
              </div>
            </div>
            
            <button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('链接已复制到剪贴板！');
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-stone-50 hover:bg-stone-100 text-stone-600 font-medium text-sm transition-colors border border-stone-200/50 dark:bg-stone-800 dark:hover:bg-stone-700 dark:text-stone-300 dark:border-stone-700/50"
            >
              <Share2 className="w-4 h-4" /> 分享文章
            </button>
          </footer>

          {/* Comment Section */}
          <div className="mt-20 pt-10 border-t border-stone-100 relative z-10 dark:border-stone-800">
            <h3 className="text-2xl font-bold font-serif mb-8 text-stone-800 dark:text-stone-100 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" /> 评论
            </h3>

            {/* Comment Form Button */}
            <div className="mb-10 text-center">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-8 py-3 bg-stone-800 text-white rounded-xl hover:bg-stone-700 font-medium transition-colors shadow-md dark:bg-stone-200 dark:text-stone-900 dark:hover:bg-white"
              >
                写评论
              </button>
            </div>

            {/* Comment Modal */}
            <AnimatePresence>
              {isModalOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm dark:bg-black/60"
                  onClick={() => !isSubmitting && !submitSuccess && setIsModalOpen(false)}
                >
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-xl shadow-2xl dark:bg-[#1A1A1A] border border-stone-100 dark:border-stone-800 relative overflow-hidden"
                  >
                    {submitSuccess ? (
                      <div className="py-12 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 dark:bg-green-900/30">
                          <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h4 className="text-2xl font-bold text-stone-800 mb-2 dark:text-stone-100">提交成功</h4>
                        <p className="text-stone-500 dark:text-stone-400">评论将在审核通过后显示</p>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-center mb-6">
                          <h4 className="text-xl font-bold text-stone-800 dark:text-stone-100">留下你的评论</h4>
                          <button 
                            onClick={() => setIsModalOpen(false)}
                            className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors p-2"
                            disabled={isSubmitting}
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <form onSubmit={handleCommentSubmit} className="space-y-5">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                              <label className="block text-sm font-medium text-stone-700 mb-2 dark:text-stone-300">昵称 *</label>
                              <input
                                type="text"
                                value={newComment.author}
                                onChange={(e) => setNewComment({...newComment, author: e.target.value})}
                                required
                                disabled={isSubmitting}
                                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-[#2A6049]/20 focus:border-[#2A6049] outline-none transition-all dark:bg-stone-800/50 dark:border-stone-700 dark:text-stone-200 dark:focus:ring-[#4A8069]/20 dark:focus:border-[#4A8069]"
                                placeholder="怎么称呼你"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-stone-700 mb-2 dark:text-stone-300">邮箱 (可选)</label>
                              <input
                                type="email"
                                value={newComment.email}
                                onChange={(e) => setNewComment({...newComment, email: e.target.value})}
                                disabled={isSubmitting}
                                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-[#2A6049]/20 focus:border-[#2A6049] outline-none transition-all dark:bg-stone-800/50 dark:border-stone-700 dark:text-stone-200 dark:focus:ring-[#4A8069]/20 dark:focus:border-[#4A8069]"
                                placeholder="用于接收回复通知"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-stone-700 mb-2 dark:text-stone-300">评论内容 *</label>
                            <textarea
                              value={newComment.content}
                              onChange={(e) => setNewComment({...newComment, content: e.target.value})}
                              rows={5}
                              required
                              disabled={isSubmitting}
                              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-[#2A6049]/20 focus:border-[#2A6049] outline-none transition-all resize-none dark:bg-stone-800/50 dark:border-stone-700 dark:text-stone-200 dark:focus:ring-[#4A8069]/20 dark:focus:border-[#4A8069]"
                              placeholder="写下你的想法..."
                            />
                          </div>
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3.5 bg-[#2A6049] text-white rounded-xl hover:bg-[#1f4736] font-medium transition-colors shadow-sm dark:bg-[#4A8069] dark:hover:bg-[#3d6d58] disabled:opacity-60 disabled:cursor-not-allowed flex justify-center items-center"
                          >
                            {isSubmitting ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                提交中...
                              </>
                            ) : '发表评论'}
                          </button>
                        </form>
                      </>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Comments List */}
            <div className="space-y-6">
              {isLoading ? (
                <div className="text-center py-10 text-stone-400 dark:text-stone-500">加载评论中...</div>
              ) : comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="bg-white rounded-2xl p-6 border border-stone-100 dark:bg-[#1A1A1A] dark:border-stone-800">
                    <div className="flex items-start justify-between">
                      <div>
                        <h5 className="font-medium text-stone-800 dark:text-stone-100">{comment.author}</h5>
                        <p className="text-sm text-stone-400 font-mono mt-1 dark:text-stone-500">{new Date(comment.createdAt).toLocaleDateString()}</p>
                      </div>
                      <button
                        onClick={() => handleLikeComment(comment.id)}
                        className="flex items-center gap-1 text-stone-400 hover:text-[#2A6049] transition-colors dark:text-stone-500 dark:hover:text-[#4A8069]"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-sm">{comment.likes}</span>
                      </button>
                    </div>
                    <p className="mt-4 text-stone-600 dark:text-stone-300">{comment.content}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-stone-400 dark:text-stone-500">暂无评论，快来发表你的看法吧！</div>
              )}
            </div>
          </div>
        </motion.article>
      </main>
    </div>
  );
}
