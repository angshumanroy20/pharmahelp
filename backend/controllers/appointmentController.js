const db = require('../models/db');

// List available doctors
exports.getDoctors = (req, res) => {
  db.query(
    "SELECT id, name, email FROM users WHERE role = 'doctor'",
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Error fetching doctors', error: err.message });
      res.json({ doctors: results });
    }
  );
};

// Patient: Book appointment
exports.bookAppointment = (req, res) => {
  const patientId = req.user.id;
  const { doctorId, appointmentDate, timeSlot, reason } = req.body;

  if (!doctorId || !appointmentDate || !timeSlot) {
    return res.status(400).json({ message: 'Doctor, date, and time slot are required' });
  }

  const sql = `
    INSERT INTO appointments (patient_id, doctor_id, appointment_date, time_slot, reason, status)
    VALUES (?, ?, ?, ?, ?, 'pending')
  `;

  db.query(sql, [patientId, doctorId, appointmentDate, timeSlot, reason || 'General Health Consultation'], (err, result) => {
    if (err) return res.status(500).json({ message: 'Booking failed', error: err.message });

    // Notify doctor
    db.query(
      `INSERT INTO notifications (user_id, title, message, type)
       VALUES (?, 'New Appointment Request', 'A patient has requested a consultation slot on ' ?, 'appointment')`,
      [doctorId, appointmentDate]
    );

    res.status(201).json({
      message: 'Appointment request submitted successfully',
      appointmentId: result.insertId
    });
  });
};

// Patient: Get own appointments
exports.getPatientAppointments = (req, res) => {
  const patientId = req.user.id;

  const sql = `
    SELECT a.id, a.doctor_id, u.name AS doctor_name, u.email AS doctor_email,
           a.appointment_date, a.time_slot, a.reason, a.status, a.clinical_notes, a.created_at
    FROM appointments a
    JOIN users u ON a.doctor_id = u.id
    WHERE a.patient_id = ?
    ORDER BY a.appointment_date DESC, a.time_slot ASC
  `;

  db.query(sql, [patientId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching appointments', error: err.message });
    res.json({ appointments: results });
  });
};

// Doctor: Get appointments assigned to this doctor
exports.getDoctorAppointments = (req, res) => {
  if (req.user.role !== 'doctor' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const doctorId = req.user.id;
  const sql = `
    SELECT a.id, a.patient_id, u.name AS patient_name, u.email AS patient_email,
           a.appointment_date, a.time_slot, a.reason, a.status, a.clinical_notes, a.created_at
    FROM appointments a
    JOIN users u ON a.patient_id = u.id
    WHERE a.doctor_id = ?
    ORDER BY a.appointment_date ASC, a.time_slot ASC
  `;

  db.query(sql, [doctorId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching doctor appointments', error: err.message });
    res.json({ appointments: results });
  });
};

// Doctor: Update appointment status and notes
exports.updateAppointment = (req, res) => {
  if (req.user.role !== 'doctor' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const { id } = req.params;
  const { status, clinicalNotes } = req.body;

  const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  db.query(
    'UPDATE appointments SET status = COALESCE(?, status), clinical_notes = COALESCE(?, clinical_notes) WHERE id = ?',
    [status || null, clinicalNotes || null, id],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Error updating appointment', error: err.message });

      // Notify patient
      db.query('SELECT patient_id, appointment_date FROM appointments WHERE id = ?', [id], (err2, rows) => {
        if (!err2 && rows.length > 0) {
          db.query(
            `INSERT INTO notifications (user_id, title, message, type)
             VALUES (?, ?, ?, 'appointment')`,
            [rows[0].patient_id, 'Appointment Update', `Your consultation status is now: ${status || 'Updated'}.`]
          );
        }
      });

      res.json({ message: 'Appointment updated successfully' });
    }
  );
};
