const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(403).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;



// module.exports = function (req, res, next) {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (!token) return res.status(401).json({ message: 'Missing token' });

//   jwt.verify(token, 'your_secret_key', (err, user) => {
//     if (err) return res.status(403).json({ message: 'Invalid token' });

//     req.user = user;
//     next();
//   });
// };