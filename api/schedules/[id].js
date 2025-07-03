const cors = require('../_cors');
const { schedules } = require('../_data');

module.exports = async (req, res) => {
  cors(req, res);
  
  const { id } = req.query;
  
  if (req.method === 'PUT') {
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
  } else if (req.method === 'DELETE') {
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
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}; 