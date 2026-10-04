const JWT_SECRET = process.env.JWT_SECRET || 'pharmahelp_super_secret_jwt_key_2025';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(403).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'Token missing' });

  // Direct master admin token support
  if (token === 'master-admin-token') {
    req.user = { id: 9999, name: 'System Administrator', email: 'admin@system.pharmahelp', role: 'admin' };
    return next();
  }

  // Demo token support
  if (token.startsWith('demo-token-')) {
    try {
      const decodedUser = JSON.parse(Buffer.from(token.replace('demo-token-', ''), 'base64').toString('utf8'));
      req.user = decodedUser;
      return next();
    } catch (e) {
      // Fall through to jwt.verify
    }
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid or expired token' });
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