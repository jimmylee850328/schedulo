const cors = require('./_cors');
const { schedules, users } = require('./_data');
const { v4: uuidv4 } = require('uuid');

module.exports = async (req, res) => {
  cors(req, res);
  
  if (req.method === 'GET') {
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
  } else if (req.method === 'POST') {
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
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}; 