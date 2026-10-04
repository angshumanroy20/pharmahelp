const db = require('./db');

const seedData = async () => {
  console.log('🌱 Seeding initial enriched healthcare data...');

  const query = (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.query(sql, params, (err, res) => {
        if (err) return reject(err);
        resolve(res);
      });
    });
  };

  try {
    const medicines = [
      { name: 'Paracetamol 650mg', usage: 'Fever, mild-to-moderate headache and body ache', stock: 120, substitutes: 'Dolo 650, Calpol 650', category: 'Analgesics & Antipyretics', price: 4.50, manufacturer: 'GlaxoSmithKline', dosage_form: 'Tablet', requires_prescription: 0 },
      { name: 'Amoxicillin 500mg', usage: 'Bacterial infections, respiratory tract infections', stock: 45, substitutes: 'Mox 500, Novamox 500', category: 'Antibiotics', price: 18.20, manufacturer: 'Alkem Labs', dosage_form: 'Capsule', requires_prescription: 1 },
      { name: 'Cetirizine 10mg', usage: 'Allergies, runny nose, sneezing, skin hives', stock: 85, substitutes: 'Cetzine, Zyrtec', category: 'Antihistamines', price: 6.00, manufacturer: 'Dr. Reddy Labs', dosage_form: 'Tablet', requires_prescription: 0 },
      { name: 'Metformin 500mg SR', usage: 'Type-2 Diabetes blood glucose regulation', stock: 60, substitutes: 'Glycomet, Glucophage', category: 'Antidiabetic', price: 12.00, manufacturer: 'USV Pharma', dosage_form: 'Tablet', requires_prescription: 1 },
      { name: 'Atorvastatin 10mg', usage: 'High cholesterol, cardiovascular disease prevention', stock: 50, substitutes: 'Atorva, Lipitor', category: 'Cardiovascular', price: 22.50, manufacturer: 'Zydus Cadila', dosage_form: 'Tablet', requires_prescription: 1 },
      { name: 'Omeprazole 20mg', usage: 'Acid reflux, heartburn, peptic ulcers', stock: 90, substitutes: 'Omez, Prilosec', category: 'Gastrointestinal', price: 9.75, manufacturer: 'Cipla Ltd', dosage_form: 'Capsule', requires_prescription: 0 },
      { name: 'Ibuprofen 400mg', usage: 'Inflammation, joint pain, muscle swelling', stock: 70, substitutes: 'Brufen, Advil', category: 'Anti-inflammatory', price: 7.50, manufacturer: 'Abbott Healthcare', dosage_form: 'Tablet', requires_prescription: 0 },
      { name: 'Azithromycin 500mg', usage: 'Severe bacterial respiratory & throat infections', stock: 35, substitutes: 'Azee 500, Zithromax', category: 'Antibiotics', price: 25.00, manufacturer: 'Cipla Ltd', dosage_form: 'Tablet', requires_prescription: 1 },
      { name: 'Pantoprazole DSR', usage: 'Severe acidity, GERD, nausea with gastric distress', stock: 80, substitutes: 'Pan-D, Pantocid DSR', category: 'Gastrointestinal', price: 14.80, manufacturer: 'Sun Pharma', dosage_form: 'Capsule', requires_prescription: 1 },
      { name: 'Vitamin C + Zinc Chewable', usage: 'Immunity booster, daily antioxidant support', stock: 150, substitutes: 'Limcee, Celin 500', category: 'Vitamins & Supplements', price: 8.50, manufacturer: 'Piramal Healthcare', dosage_form: 'Chewable Tablet', requires_prescription: 0 }
    ];

    for (const m of medicines) {
      await query(
        `INSERT INTO medicines (name, \`usage\`, stock, substitutes, category, price, manufacturer, dosage_form, requires_prescription)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           \`usage\` = VALUES(\`usage\`),
           stock = VALUES(stock),
           substitutes = VALUES(substitutes),
           category = VALUES(category),
           price = VALUES(price),
           manufacturer = VALUES(manufacturer),
           dosage_form = VALUES(dosage_form),
           requires_prescription = VALUES(requires_prescription)`,
        [m.name, m.usage, m.stock, m.substitutes, m.category, m.price, m.manufacturer, m.dosage_form, m.requires_prescription]
      );
    }
    console.log('✅ Medicine catalog seeded.');

    // Seed sample appointments if none exist
    const appointments = await query('SELECT COUNT(*) as count FROM appointments');
    if (appointments[0].count === 0) {
      const users = await query('SELECT id, role FROM users');
      const patient = users.find(u => u.role === 'patient') || users[0];
      const doctor = users.find(u => u.role === 'doctor') || users[0];

      if (patient && doctor) {
        await query(
          `INSERT INTO appointments (patient_id, doctor_id, appointment_date, time_slot, reason, status, clinical_notes)
           VALUES (?, ?, CURDATE() + INTERVAL 2 DAY, '10:30 AM', 'Routine blood pressure review & seasonal allergies follow-up', 'confirmed', 'Patient should bring recent blood pressure logs.')`,
          [patient.id, doctor.id]
        );
        await query(
          `INSERT INTO appointments (patient_id, doctor_id, appointment_date, time_slot, reason, status, clinical_notes)
           VALUES (?, ?, CURDATE() + INTERVAL 5 DAY, '02:00 PM', 'Follow-up consultation for mild migraine and fatigue', 'pending', NULL)`,
          [patient.id, doctor.id]
        );
        console.log('✅ Sample appointments created.');
      }
    }

    // Seed sample medication reminders if none exist
    const reminders = await query('SELECT COUNT(*) as count FROM medication_reminders');
    if (reminders[0].count === 0) {
      const patients = await query("SELECT id FROM users WHERE role = 'patient'");
      if (patients.length > 0) {
        const pId = patients[0].id;
        await query(
          `INSERT INTO medication_reminders (patient_id, medicine_name, dosage, time_of_day, frequency, instructions, is_taken)
           VALUES (?, 'Paracetamol 650mg', '1 Tablet', '08:00 AM', 'Daily', 'Take after breakfast', 1)`,
          [pId]
        );
        await query(
          `INSERT INTO medication_reminders (patient_id, medicine_name, dosage, time_of_day, frequency, instructions, is_taken)
           VALUES (?, 'Cetirizine 10mg', '1 Tablet', '09:00 PM', 'Daily', 'Take at bedtime', 0)`,
          [pId]
        );
        await query(
          `INSERT INTO medication_reminders (patient_id, medicine_name, dosage, time_of_day, frequency, instructions, is_taken)
           VALUES (?, 'Vitamin C + Zinc', '1 Tablet', '01:00 PM', 'Daily', 'Chewable after lunch', 0)`,
          [pId]
        );
        console.log('✅ Sample medication reminders created.');
      }
    }

    // Seed sample orders if none exist
    const orders = await query('SELECT COUNT(*) as count FROM orders');
    if (orders[0].count === 0) {
      const patients = await query("SELECT id FROM users WHERE role = 'patient'");
      if (patients.length > 0) {
        const pId = patients[0].id;
        const items = JSON.stringify([
          { name: 'Paracetamol 650mg', quantity: 2, price: 4.50 },
          { name: 'Cetirizine 10mg', quantity: 1, price: 6.00 }
        ]);
        await query(
          `INSERT INTO orders (patient_id, items, total_amount, delivery_address, payment_method, status, notes)
           VALUES (?, ?, 15.00, 'Flat 402, Green Park Avenue, Sector 5', 'Online Pre-paid', 'processing', 'Urgent delivery requested')`,
          [pId, items]
        );
        console.log('✅ Sample orders created.');
      }
    }

    // Seed sample notifications if none exist
    const notifications = await query('SELECT COUNT(*) as count FROM notifications');
    if (notifications[0].count === 0) {
      const users = await query('SELECT id FROM users');
      for (const u of users) {
        await query(
          `INSERT INTO notifications (user_id, title, message, type)
           VALUES (?, 'Welcome to PharmaHelp 2.0', 'Your healthcare dashboard has been upgraded with prescription AI scanning, smart reminders, and teleconsultation.', 'system')`,
          [u.id]
        );
      }
      console.log('✅ Sample notifications created.');
    }

    console.log('🎉 Database seeding complete!');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
};

module.exports = seedData;

if (require.main === module) {
  seedData().then(() => process.exit(0));
}
