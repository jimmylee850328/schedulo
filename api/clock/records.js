const cors = require('../_cors');
const { clockRecords, users } = require('../_data');

module.exports = async (req, res) => {
  cors(req, res);
  
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  const { userId, date } = req.query;
  
  let records = clockRecords;
  
  if (userId) {
    records = records.filter(r => r.userId === userId);
  }
  
  if (date) {
    const targetDate = new Date(date).toDateString();
    records = records.filter(r => new Date(r.timestamp).toDateString() === targetDate);
  }
  
  // 加入使用者名稱
  records = records.map(record => ({
    ...record,
    userName: users.find(u => u.id === record.userId)?.name || '未知使用者'
  }));
  
  res.json({
    success: true,
    data: records
  });
}; 