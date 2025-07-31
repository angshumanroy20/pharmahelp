// doctorController.js
const db = require("../models/db");

exports.getSideEffects = (req, res) => {
  if (req.user.role !== "doctor") {
    return res.status(403).json({ message: "Access denied" });
  }

  db.query(
    `
    SELECT se.id, u.name AS patient_name, se.symptom, se.date_reported,
           se.pharmacist_reply, se.is_verified, se.doctor_reply
    FROM side_effects se
    JOIN users u ON se.patient_id = u.id
    ORDER BY se.date_reported DESC
  `,
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ reports: results });
    }
  );
};

exports.verifyAndReply = (req, res) => {
  if (req.user.role !== "doctor") {
    return res.status(403).json({ message: "Access denied" });
  }

  const { id } = req.params;
  const { doctor_reply } = req.body;
  const verified_by = req.user.id;

  console.log("BODY:", req.body);
  console.log("PARAM ID:", req.params.id);
  console.log("USER:", req.user);

  // Add these debug logs:
  console.log("Preparing to update side effect:");
  console.log("doctor_reply:", doctor_reply);
  console.log("verified_by:", verified_by);
  console.log("id:", id);

  //   db.query(
  //     `
  //     UPDATE side_effects
  //     SET is_verified = 1, doctor_reply = ?, verified_by = ?
  //     WHERE id = ?
  //   `,
  //     [doctor_reply, verified_by, id],
  //     (err, result) => {
  //       if (err) {
  //         console.error("Update error:", err);
  //         return res.status(500).json({ error: err });
  //       }

  //       console.log("Update result:", result);
  //       res.json({
  //         message: "Side effect verified and reply sent to pharmacist",
  //       });
  //     }
  //   );
  console.log("Updating side effect ID:", id);

  db.query(
    `
  UPDATE side_effects 
  SET is_verified = 1, doctor_reply = ?, verified_by = ? 
  WHERE id = ?
  `,
    [doctor_reply, verified_by, id],
    (err, result) => {
      if (err) {
        console.error("Update error:", err);
        return res.status(500).json({ error: err });
      }

      if (result.affectedRows === 0) {
        console.warn(`No side effect found with id ${id}.`);
        return res
          .status(404)
          .json({ message: "No matching side effect found" });
      }

      console.log("Side effect updated successfully.");
      res.json({
        message: "Side effect verified and reply sent to pharmacist",
      });
    }
  );
};
