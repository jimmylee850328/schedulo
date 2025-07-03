const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3001;

// 中間件
app.use(cors());
app.use(express.json());

// 速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分鐘
  max: 100 // 每個 IP 最多 100 次請求
});
app.use(limiter);

// 模擬資料庫
let users = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    role: 'manager',
    name: '管理員'
  },
  {
    id: '2',
    username: 'employee',
    password: 'emp123',
    role: 'employee',
    name: '普通員工'
  }
];

let companySettings = {
  location: {
    latitude: 25.033964,
    longitude: 121.564468,
    address: '台北市信義區市府路1號',
    radius: 100 // 允許的打卡範圍（公尺）
  }
};

let clockRecords = [];
let schedules = [];

// 計算兩個座標之間的距離（公尺）
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // 地球半徑（公尺）
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
}

// API 路由

// 登入
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  const user = users.find(u => u.username === username && u.password === password);
  
  if (user) {
    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: '使用者名稱或密碼錯誤'
    });
  }
});

// 取得公司位置設定
app.get('/api/company/location', (req, res) => {
  res.json({
    success: true,
    data: companySettings.location
  });
});

// 更新公司位置設定（僅管理員）
app.put('/api/company/location', (req, res) => {
  const { latitude, longitude, address, radius } = req.body;
  
  companySettings.location = {
    latitude,
    longitude,
    address,
    radius
  };
  
  res.json({
    success: true,
    data: companySettings.location
  });
});

// 打卡
app.post('/api/clock', (req, res) => {
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
});

// 取得打卡記錄
app.get('/api/clock/records', (req, res) => {
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
});

// 新增排班
app.post('/api/schedules', (req, res) => {
  const { userId, date, startTime, endTime, notes } = req.body;
  
  const schedule = {
    id: uuidv4(),
    userId,
    date,
    startTime,
    endTime,
    notes: notes || '',
    createdAt: new Date().toISOString()
  };
  
  schedules.push(schedule);
  
  res.json({
    success: true,
    data: schedule
  });
});

// 取得排班表
app.get('/api/schedules', (req, res) => {
  const { userId, startDate, endDate } = req.query;
  
  let filteredSchedules = schedules;
  
  if (userId) {
    filteredSchedules = filteredSchedules.filter(s => s.userId === userId);
  }
  
  if (startDate && endDate) {
    filteredSchedules = filteredSchedules.filter(s => 
      s.date >= startDate && s.date <= endDate
    );
  }
  
  // 加入使用者名稱
  filteredSchedules = filteredSchedules.map(schedule => ({
    ...schedule,
    userName: users.find(u => u.id === schedule.userId)?.name || '未知使用者'
  }));
  
  res.json({
    success: true,
    data: filteredSchedules
  });
});

// 更新排班
app.put('/api/schedules/:id', (req, res) => {
  const { id } = req.params;
  const { date, startTime, endTime, notes } = req.body;
  
  const scheduleIndex = schedules.findIndex(s => s.id === id);
  
  if (scheduleIndex === -1) {
    return res.status(404).json({
      success: false,
      message: '排班記錄不存在'
    });
  }
  
  schedules[scheduleIndex] = {
    ...schedules[scheduleIndex],
    date,
    startTime,
    endTime,
    notes: notes || '',
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    data: schedules[scheduleIndex]
  });
});

// 刪除排班
app.delete('/api/schedules/:id', (req, res) => {
  const { id } = req.params;
  
  const scheduleIndex = schedules.findIndex(s => s.id === id);
  
  if (scheduleIndex === -1) {
    return res.status(404).json({
      success: false,
      message: '排班記錄不存在'
    });
  }
  
  schedules.splice(scheduleIndex, 1);
  
  res.json({
    success: true,
    message: '排班記錄已刪除'
  });
});

// 取得所有使用者（僅管理員）
app.get('/api/users', (req, res) => {
  const publicUsers = users.map(({ password, ...user }) => user);
  res.json({
    success: true,
    data: publicUsers
  });
});

app.listen(PORT, () => {
  console.log(`HR Backend API 運行在 http://localhost:${PORT}`);
}); 