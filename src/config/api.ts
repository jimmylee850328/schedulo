// API 配置
const API_CONFIG = {
  // 開發環境使用本地 Express 伺服器，生產環境使用 Vercel API Routes
  baseURL: window.location.hostname === 'localhost' 
    ? 'http://localhost:3001/api' 
    : '/api'
}

export default API_CONFIG 