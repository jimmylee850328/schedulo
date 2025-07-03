const cors = require('./_cors');
const { users } = require('./_data');

module.exports = async (req, res) => {
  cors(req, res);
  
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  const publicUsers = users.map(({ password, ...user }) => user);
  res.json({
    success: true,
    data: publicUsers
  });
}; 