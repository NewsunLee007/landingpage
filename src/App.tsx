import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import { useStore } from './store/useStore';

const Home = lazy(() => import('./pages/Home'));
const Admin = lazy(() => import('./pages/Admin'));
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'));
const ApiHub = lazy(() => import('./pages/ApiHub'));
const NotFound = lazy(() => import('./pages/NotFound'));

function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0F0F0F] flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-8 h-8 border-2 border-[#2A6049]/20 border-t-[#2A6049] rounded-full dark:border-[#4A8069]/20 dark:border-t-[#4A8069]"
      />
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  const { initialize } = useStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/article/:id" element={<ArticleDetail />} />
        <Route path="/api-hub" element={<ApiHub />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Suspense fallback={<LoadingSpinner />}>
          <AnimatedRoutes />
        </Suspense>
      </Router>
    </HelmetProvider>
  );
}

export default App;
