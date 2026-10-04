const db = require('./db');

const initDb = async () => {
  console.log('🔄 Checking and initializing database tables...');

  const executeQuery = (sql, values = []) => {
    return new Promise((resolve, reject) => {
      db.query(sql, values, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  };

  try {
    // 1. Ensure extra columns in medicines if missing
    try {
      await executeQuery(`ALTER TABLE medicines ADD COLUMN category VARCHAR(100) DEFAULT 'General'`);
    } catch (e) { /* Column may already exist */ }

    try {
      await executeQuery(`ALTER TABLE medicines ADD COLUMN price DECIMAL(10,2) DEFAULT 12.50`);
    } catch (e) { /* Column may already exist */ }

    try {
      await executeQuery(`ALTER TABLE medicines ADD COLUMN manufacturer VARCHAR(150) DEFAULT 'PharmaCore Labs'`);
    } catch (e) { /* Column may already exist */ }

    try {
      await executeQuery(`ALTER TABLE medicines ADD COLUMN dosage_form VARCHAR(50) DEFAULT 'Tablet'`);
    } catch (e) { /* Column may already exist */ }

    try {
      await executeQuery(`ALTER TABLE medicines ADD COLUMN requires_prescription TINYINT(1) DEFAULT 0`);
    } catch (e) { /* Column may already exist */ }

    // 2. Orders Table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        patient_id INT NOT NULL,
        items TEXT NOT NULL,
        total_amount DECIMAL(10,2) DEFAULT 0.00,
        delivery_address TEXT,
        payment_method VARCHAR(50) DEFAULT 'Cash on Delivery',
        status ENUM('pending', 'processing', 'ready', 'dispatched', 'delivered', 'cancelled') DEFAULT 'pending',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 3. Appointments Table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        patient_id INT NOT NULL,
        doctor_id INT NOT NULL,
        appointment_date DATE NOT NULL,
        time_slot VARCHAR(50) NOT NULL,
        reason TEXT,
        status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
        clinical_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 4. Medication Reminders Table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS medication_reminders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        patient_id INT NOT NULL,
        medicine_name VARCHAR(255) NOT NULL,
        dosage VARCHAR(100) NOT NULL,
        time_of_day VARCHAR(50) NOT NULL,
        frequency VARCHAR(50) DEFAULT 'Daily',
        instructions VARCHAR(255) DEFAULT 'After meals',
        is_taken TINYINT(1) DEFAULT 0,
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 5. Notifications Table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type ENUM('prescription', 'side_effect', 'order', 'appointment', 'reminder', 'system') DEFAULT 'system',
        is_read TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Database tables initialized successfully.');
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
  }
};

module.exports = initDb;
