import AV from 'leancloud-storage';

// 这里是 LeanCloud 的初始化配置
// 为了安全，真正的密钥应该放在 .env 文件中，例如：
// VITE_LEANCLOUD_APP_ID=your_app_id
// VITE_LEANCLOUD_APP_KEY=your_app_key
// VITE_LEANCLOUD_SERVER_URL=your_server_url

const appId = import.meta.env.VITE_LEANCLOUD_APP_ID || '';
const appKey = import.meta.env.VITE_LEANCLOUD_APP_KEY || '';
const serverURL = import.meta.env.VITE_LEANCLOUD_SERVER_URL || '';

export const isDbConfigured = Boolean(appId && appKey && serverURL);

if (isDbConfigured) {
  try {
    AV.init({
      appId,
      appKey,
      serverURL,
    });
  } catch (error) {
    console.error('LeanCloud 初始化失败:', error);
  }
}

export default AV;