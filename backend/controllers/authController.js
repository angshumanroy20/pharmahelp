const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/db');

const JWT_SECRET = process.env.JWT_SECRET || 'pharmahelp_super_secret_jwt_key_2025';

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields including role are required" });
  }

  const validRoles = ['patient', 'admin', 'pharmacist', 'doctor'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: "Invalid role selected" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email.toLowerCase().trim(), hashedPassword, role],
      (err, result) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Email is already registered' });
          }
          return res.status(500).json({ message: 'Database error', error: err.message });
        }
        res.status(201).json({ message: 'User registered successfully. You can now login.' });
      }
    );
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'User with this email not found' });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid password credentials' });

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

// 1-Click Demo Login for testing and rapid switching between roles
exports.demoLogin = (req, res) => {
  const { role } = req.body; // 'patient' | 'doctor' | 'pharmacist' | 'admin'
  const validRoles = ['patient', 'doctor', 'pharmacist', 'admin'];

  const targetRole = validRoles.includes(role) ? role : 'patient';

  db.query('SELECT * FROM users WHERE role = ? LIMIT 1', [targetRole], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err.message });

    if (results.length > 0) {
      const user = results[0];
      const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      return res.json({
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      });
    }

    // If no user exists with this role, create a default demo user
    const defaultUsers = {
      patient: { name: 'Angshuman Roy', email: 'patient.demo@pharmahelp.com' },
      doctor: { name: 'Dr. Alice Grey, MD', email: 'doctor.demo@pharmahelp.com' },
      pharmacist: { name: 'Ping (Lead Pharmacist)', email: 'pharmacist.demo@pharmahelp.com' },
      admin: { name: 'Pawan (System Admin)', email: 'admin.demo@pharmahelp.com' }
    };

    const targetUser = defaultUsers[targetRole];
    const hashedPassword = await bcrypt.hash('DemoPass123!', 10);

    db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [targetUser.name, targetUser.email, hashedPassword, targetRole],
      (err2, insertResult) => {
        if (err2) return res.status(500).json({ message: 'Failed to create demo user', error: err2.message });

        const newUser = { id: insertResult.insertId, name: targetUser.name, email: targetUser.email, role: targetRole };
        const token = jwt.sign(newUser, JWT_SECRET, { expiresIn: '7d' });

        res.json({ token, user: newUser });
      }
    );
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
