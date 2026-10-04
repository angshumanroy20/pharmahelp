const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables from root or backend
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config();

const express = require('express');
const cors = require('cors');

// Initialize database schema
const initDb = require('./models/initDb');
initDb().catch(err => console.error('Database initialization warning:', err.message));

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure upload directories exist
const uploadDir = path.join(__dirname, '../uploads/prescriptions');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/images', express.static(path.join(__dirname, '../uploads/images')));
app.use('/images', express.static(path.join(__dirname, '../frontend/public/images')));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/medicines', require('./routes/medicineRoutes'));
app.use('/api/prescriptions', require('./routes/prescriptionRoutes'));
app.use('/api/side-effects', require('./routes/sideEffectRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/doctor', require('./routes/doctorRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/reminders', require('./routes/reminderRoutes'));
app.use('/api/clinical-ai', require('./routes/clinicalAIRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'PharmaHelp Healthcare API',
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend build if exists
const frontendDist = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      return res.sendFile(path.join(frontendDist, 'index.html'));
    }
    next();
  });
}

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 PharmaHelp Backend Server running on http://localhost:${PORT}`);
});

module.exports = app;
