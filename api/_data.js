// 模擬資料庫 - 在實際生產環境中，應該使用真正的資料庫
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
    radius: 100
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

module.exports = {
  users,
  companySettings,
  clockRecords,
  schedules,
  calculateDistance
}; 