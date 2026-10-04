const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/db');

const JWT_SECRET = process.env.JWT_SECRET || 'pharmahelp_super_secret_jwt_key_2025';

// Check if a system admin already exists
exports.getAdminStatus = (req, res) => {
  db.query("SELECT COUNT(*) AS adminCount FROM users WHERE role = 'admin'", (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err.message });
    const count = results[0]?.adminCount || results[0]?.val || 0;
    res.json({ hasAdmin: count > 0 });
  });
};

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields including role are required" });
  }

  const validRoles = ['patient', 'admin', 'pharmacist', 'doctor'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: "Invalid role selected" });
  }

  const proceedWithRegistration = async () => {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      db.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name.trim(), email.toLowerCase().trim(), hashedPassword, role],
        (err, result) => {
          if (err) {
            if (err.code === 'ER_DUP_ENTRY' || (err.message && err.message.includes('duplicate'))) {
              return res.status(400).json({ message: 'An account with this email is already registered' });
            }
            return res.status(500).json({ message: 'Database error', error: err.message });
          }
          res.status(201).json({ message: 'Account registered successfully. You can now login.' });
        }
      );
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };

  // Enforce: System admin is available ONLY to the one person registering for the first time
  if (role === 'admin') {
    db.query("SELECT COUNT(*) AS adminCount FROM users WHERE role = 'admin'", (err, results) => {
      if (err) return res.status(500).json({ message: 'Database check failed' });
      const adminCount = results[0]?.adminCount || results[0]?.val || 0;
      if (adminCount > 0) {
        return res.status(403).json({
          message: 'The System Administrator role has already been claimed. System admin is only available to the first registering administrator.'
        });
      }
      proceedWithRegistration();
    });
  } else {
    proceedWithRegistration();
  }
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'No account found with this email' });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  });
};

// Get current user profile
exports.getMe = (req, res) => {
  db.query('SELECT id, name, email, role FROM users WHERE id = ?', [req.user.id], (err, results) => {
    if (err || results.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json({ user: results[0] });
  });
};

// Admin: Get all users
exports.getAllUsers = (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  db.query('SELECT id, name, email, role FROM users ORDER BY id DESC', (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err.message });
    res.json({ users: results });
  });
};

// Admin: Update user role
exports.updateUserRole = (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  const { id } = req.params;
  const { role } = req.body;

  const validRoles = ['patient', 'doctor', 'pharmacist', 'admin'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  db.query('UPDATE users SET role = ? WHERE id = ?', [role, id], (err) => {
    if (err) return res.status(500).json({ message: 'Failed to update role', error: err.message });
    res.json({ message: 'User role updated successfully' });
  });
};
