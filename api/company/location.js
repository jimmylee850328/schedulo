const cors = require('../_cors');
const { companySettings } = require('../_data');

module.exports = async (req, res) => {
  cors(req, res);
  
  if (req.method === 'GET') {
    res.json({
      success: true,
      data: companySettings.location
    });
  } else if (req.method === 'PUT') {
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
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}; 