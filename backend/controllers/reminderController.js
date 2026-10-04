const db = require('../models/db');

// Patient: Get reminders
exports.getReminders = (req, res) => {
  const patientId = req.user.id;

  db.query(
    'SELECT * FROM medication_reminders WHERE patient_id = ? ORDER BY time_of_day ASC',
    [patientId],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Error fetching reminders', error: err.message });
      res.json({ reminders: results });
    }
  );
};

// Patient: Add reminder
exports.addReminder = (req, res) => {
  const patientId = req.user.id;
  const { medicineName, dosage, timeOfDay, frequency, instructions } = req.body;

  if (!medicineName || !dosage || !timeOfDay) {
    return res.status(400).json({ message: 'Medicine name, dosage, and time are required' });
  }

  const sql = `
    INSERT INTO medication_reminders (patient_id, medicine_name, dosage, time_of_day, frequency, instructions, is_taken, is_active)
    VALUES (?, ?, ?, ?, ?, ?, 0, 1)
  `;

  db.query(
    sql,
    [patientId, medicineName, dosage, timeOfDay, frequency || 'Daily', instructions || 'Take after meal'],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Failed to add reminder', error: err.message });
      res.status(201).json({ message: 'Reminder added successfully', id: result.insertId });
    }
  );
};

// Patient: Toggle taken status
exports.toggleTaken = (req, res) => {
  const patientId = req.user.id;
  const { id } = req.params;

  db.query(
    'UPDATE medication_reminders SET is_taken = NOT is_taken WHERE id = ? AND patient_id = ?',
    [id, patientId],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Failed to toggle status', error: err.message });
      res.json({ message: 'Reminder updated successfully' });
    }
  );
};

// Patient: Delete reminder
exports.deleteReminder = (req, res) => {
  const patientId = req.user.id;
  const { id } = req.params;

  db.query(
    'DELETE FROM medication_reminders WHERE id = ? AND patient_id = ?',
    [id, patientId],
    (err) => {
      if (err) return res.status(500).json({ message: 'Failed to delete reminder', error: err.message });
      res.json({ message: 'Reminder deleted' });
    }
  );
};
