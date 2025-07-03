const cors = require('./_cors');
const { users } = require('./_data');

module.exports = async (req, res) => {
  cors(req, res);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
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
}; 