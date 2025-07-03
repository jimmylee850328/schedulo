const cors = require('./_cors');
const { clockRecords, companySettings, calculateDistance, users } = require('./_data');
const { v4: uuidv4 } = require('uuid');

module.exports = async (req, res) => {
  cors(req, res);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  const { userId, type, latitude, longitude } = req.body;
  
  // 檢查距離
  const distance = calculateDistance(
    latitude,
    longitude,
    companySettings.location.latitude,
    companySettings.location.longitude
  );
  
  const isInRange = distance <= companySettings.location.radius;
  
  const record = {
    id: uuidv4(),
    userId,
    type, // 'in' 或 'out'
    timestamp: new Date().toISOString(),
    location: { latitude, longitude },
    distance: Math.round(distance),
    isInRange,
    needsApproval: !isInRange
  };
  
  clockRecords.push(record);
  
  res.json({
    success: true,
    data: record,
    message: isInRange ? '打卡成功' : `打卡成功，但距離公司 ${Math.round(distance)} 公尺，需要主管審核`
  });
}; 