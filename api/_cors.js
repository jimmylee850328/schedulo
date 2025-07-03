// CORS 處理中間件
function cors(req, res, next) {
  // 設定 CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // 處理 preflight 請求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (next) {
    next();
  }
}

module.exports = cors; 