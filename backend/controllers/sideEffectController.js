const db = require('../models/db');

exports.reportSideEffect = (req, res) => {
  const patientId = req.user.id;
  const { symptom } = req.body;

  db.query(
    'INSERT INTO side_effects (patient_id, symptom) VALUES (?, ?)',
    [patientId, symptom],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Error reporting', error: err });
      res.status(201).json({ message: 'Reported successfully' });
    }
  );
};

exports.getReportsForAdmin = (req, res) => {
  if (req.user.role !== 'pharmacist' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  db.query(
    `SELECT se.id, u.name AS patient_name, se.symptom, se.date_reported, se.pharmacist_reply 
     FROM side_effects se
     JOIN users u ON se.patient_id = u.id
     ORDER BY se.date_reported DESC`,
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ reports: results });
    }
  );
};

exports.replyToReport = (req, res) => {
  if (req.user.role !== 'pharmacist' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const { id } = req.params;
  const { reply } = req.body;

  db.query(
    'UPDATE side_effects SET pharmacist_reply = ? WHERE id = ?',
    [reply, id],
    (err) => {
      if (err) return res.status(500).json({ message: 'Reply failed', error: err });
      res.json({ message: 'Replied successfully' });
    }
  );
};


exports.verifyAndReply = (req, res) => {
  if (req.user.role !== 'doctor') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const { id } = req.params;
  const { reply } = req.body;
  const doctorId = req.user.id;

  db.query(
    `UPDATE side_effects
     SET is_verified = 1, doctor_reply = ?, verified_by = ?
     WHERE id = ?`,
    [reply, doctorId, id],
    (err) => {
      if (err) return res.status(500).json({ message: 'Verification failed', error: err });
      res.json({ message: 'Report verified and replied to pharmacist' });
    }
  );
};


// exports.getAllSideEffects = async (req, res) => {
//   try {
//     const [reports] = await db.execute(`
//       SELECT 
//         se.id,
//         se.symptom,
//         se.date_reported,
//         se.pharmacist_reply,
//         se.doctor_reply,
//         u.name AS patient_name
//       FROM side_effects se
//       JOIN users u ON se.patient_id = u.id
//       ORDER BY se.date_reported DESC
//     `);
    
//     console.log("Query Result:", result); // See what you actually get
    
//     res.json({ reports });
//   } catch (error) {
//     console.error('Error fetching side effects:', error);
//     res.status(500).json({ message: 'Failed to fetch side effects' });
//   }
// };

exports.getAllSideEffects = (req, res) => {
  db.execute(`
    SELECT 
      se.id,
      se.symptom,
      se.date_reported,
      se.pharmacist_reply,
      se.doctor_reply,
      u.name AS patient_name
    FROM side_effects se
    JOIN users u ON se.patient_id = u.id
    ORDER BY se.date_reported DESC
  `, (error, results) => {
    if (error) {
      console.error('Error fetching side effects:', error);
      return res.status(500).json({ message: 'Failed to fetch side effects' });
    }

    res.json({ reports: results });
  });
};
