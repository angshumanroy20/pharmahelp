const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_DIR = path.join(__dirname, '../data');
const DB_FILE = path.join(DB_DIR, 'pharmahelp_db.json');

// Ensure directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// In-memory state
let data = {
  users: [],
  medicines: [],
  prescriptions: [],
  side_effects: [],
  orders: [],
  appointments: [],
  medication_reminders: [],
  notifications: []
};

// Save to disk
const saveToDisk = () => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to persist database to file:', err.message);
  }
};

// Initialize with rich seed data if file doesn't exist
const initData = () => {
  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf8');
      data = JSON.parse(content);
      console.log('📦 Loaded embedded database from', DB_FILE);
      return;
    } catch (e) {
      console.warn('Could not parse existing DB file, reinitializing...');
    }
  }

  const salt = bcrypt.genSaltSync(10);
  const demoHash = bcrypt.hashSync('DemoPass123!', salt);

  data = {
    users: [
      { id: 1, name: 'Angshuman Roy', email: 'angshumanroy200@gmail.com', password: demoHash, role: 'patient' },
      { id: 2, name: 'Pawan (System Admin)', email: 'pawan2004@gmail.com', password: demoHash, role: 'admin' },
      { id: 3, name: 'Ping (Lead Pharmacist)', email: 'ping24@gmail.com', password: demoHash, role: 'pharmacist' },
      { id: 4, name: 'Dr. Alice Grey, MD', email: 'alice200@gmail.com', password: demoHash, role: 'doctor' }
    ],
    medicines: [
      { id: 1, name: 'Paracetamol 650mg', usage: 'Fever, mild-to-moderate headache and body ache', stock: 120, substitutes: 'Dolo 650, Calpol 650', category: 'Analgesics & Antipyretics', price: 4.50, manufacturer: 'GlaxoSmithKline', dosage_form: 'Tablet', requires_prescription: 0 },
      { id: 2, name: 'Amoxicillin 500mg', usage: 'Bacterial infections, respiratory tract infections', stock: 45, substitutes: 'Mox 500, Novamox 500', category: 'Antibiotics', price: 18.20, manufacturer: 'Alkem Labs', dosage_form: 'Capsule', requires_prescription: 1 },
      { id: 3, name: 'Cetirizine 10mg', usage: 'Allergies, runny nose, sneezing, skin hives', stock: 85, substitutes: 'Cetzine, Zyrtec', category: 'Antihistamines', price: 6.00, manufacturer: 'Dr. Reddy Labs', dosage_form: 'Tablet', requires_prescription: 0 },
      { id: 4, name: 'Metformin 500mg SR', usage: 'Type-2 Diabetes blood glucose regulation', stock: 60, substitutes: 'Glycomet, Glucophage', category: 'Antidiabetic', price: 12.00, manufacturer: 'USV Pharma', dosage_form: 'Tablet', requires_prescription: 1 },
      { id: 5, name: 'Atorvastatin 10mg', usage: 'High cholesterol, cardiovascular disease prevention', stock: 50, substitutes: 'Atorva, Lipitor', category: 'Cardiovascular', price: 22.50, manufacturer: 'Zydus Cadila', dosage_form: 'Tablet', requires_prescription: 1 },
      { id: 6, name: 'Omeprazole 20mg', usage: 'Acid reflux, heartburn, peptic ulcers', stock: 90, substitutes: 'Omez, Prilosec', category: 'Gastrointestinal', price: 9.75, manufacturer: 'Cipla Ltd', dosage_form: 'Capsule', requires_prescription: 0 },
      { id: 7, name: 'Ibuprofen 400mg', usage: 'Inflammation, joint pain, muscle swelling', stock: 70, substitutes: 'Brufen, Advil', category: 'Anti-inflammatory', price: 7.50, manufacturer: 'Abbott Healthcare', dosage_form: 'Tablet', requires_prescription: 0 },
      { id: 8, name: 'Azithromycin 500mg', usage: 'Severe bacterial respiratory & throat infections', stock: 35, substitutes: 'Azee 500, Zithromax', category: 'Antibiotics', price: 25.00, manufacturer: 'Cipla Ltd', dosage_form: 'Tablet', requires_prescription: 1 },
      { id: 9, name: 'Pantoprazole DSR', usage: 'Severe acidity, GERD, nausea with gastric distress', stock: 80, substitutes: 'Pan-D, Pantocid DSR', category: 'Gastrointestinal', price: 14.80, manufacturer: 'Sun Pharma', dosage_form: 'Capsule', requires_prescription: 1 },
      { id: 10, name: 'Vitamin C + Zinc Chewable', usage: 'Immunity booster, daily antioxidant support', stock: 150, substitutes: 'Limcee, Celin 500', category: 'Vitamins & Supplements', price: 8.50, manufacturer: 'Piramal Healthcare', dosage_form: 'Chewable Tablet', requires_prescription: 0 }
    ],
    prescriptions: [
      { id: 1, patient_id: 1, doctor: 'Dr. Alice Grey, MD', date: '2026-10-02', file_url: '/images/scanner_art.jpg', filename: 'Prescription_Sample.jpg', is_verified: 1, uploaded_at: '2026-10-02T10:00:00.000Z' }
    ],
    side_effects: [
      { id: 1, patient_id: 1, symptom: 'Mild nausea and slight drowsiness after afternoon dose', date_reported: '2026-10-03', pharmacist_reply: 'Take medication with food and plenty of water.', is_verified: 1, doctor_reply: 'Symptom is consistent with transient gastrointestinal adjustment. Continue current dosage.', verified_by: 4 }
    ],
    orders: [
      { id: 101, patient_id: 1, items: '[{"name":"Paracetamol 650mg","quantity":2,"price":4.50},{"name":"Cetirizine 10mg","quantity":1,"price":6.00}]', total_amount: 15.00, delivery_address: 'Flat 402, Green Park Avenue, Sector 5', payment_method: 'Cash on Delivery', status: 'processing', notes: 'Urgent delivery requested', created_at: '2026-10-04T08:30:00.000Z' }
    ],
    appointments: [
      { id: 1, patient_id: 1, doctor_id: 4, appointment_date: '2026-10-06', time_slot: '10:30 AM', reason: 'Routine blood pressure review & seasonal allergies follow-up', status: 'confirmed', clinical_notes: 'Patient should bring recent blood pressure logs.', created_at: '2026-10-04T09:00:00.000Z' },
      { id: 2, patient_id: 1, doctor_id: 4, appointment_date: '2026-10-09', time_slot: '02:00 PM', reason: 'Follow-up consultation for mild migraine and fatigue', status: 'pending', clinical_notes: null, created_at: '2026-10-04T09:30:00.000Z' }
    ],
    medication_reminders: [
      { id: 1, patient_id: 1, medicine_name: 'Paracetamol 650mg', dosage: '1 Tablet', time_of_day: '08:00 AM', frequency: 'Daily', instructions: 'Take after breakfast', is_taken: 1, is_active: 1, created_at: '2026-10-04T07:00:00.000Z' },
      { id: 2, patient_id: 1, medicine_name: 'Cetirizine 10mg', dosage: '1 Tablet', time_of_day: '09:00 PM', frequency: 'Daily', instructions: 'Take at bedtime', is_taken: 0, is_active: 1, created_at: '2026-10-04T07:00:00.000Z' },
      { id: 3, patient_id: 1, medicine_name: 'Vitamin C + Zinc', dosage: '1 Tablet', time_of_day: '01:00 PM', frequency: 'Daily', instructions: 'Chewable after lunch', is_taken: 0, is_active: 1, created_at: '2026-10-04T07:00:00.000Z' }
    ],
    notifications: [
      { id: 1, user_id: 1, title: 'Welcome to PharmaHelp 2.0', message: 'Your healthcare dashboard has been upgraded with prescription AI scanning, smart reminders, and teleconsultation.', type: 'system', is_read: 0, created_at: '2026-10-04T06:00:00.000Z' }
    ]
  };

  saveToDisk();
  console.log('✅ Seeded new embedded database to', DB_FILE);
};

initData();

// Helper to get collection by table name
const getCollection = (tableName) => {
  const clean = tableName.toLowerCase().replace(/[`"']/g, '').trim();
  if (clean.includes('user')) return data.users;
  if (clean.includes('medicine')) return data.medicines;
  if (clean.includes('prescription')) return data.prescriptions;
  if (clean.includes('side_effect')) return data.side_effects;
  if (clean.includes('order')) return data.orders;
  if (clean.includes('appointment')) return data.appointments;
  if (clean.includes('reminder')) return data.medication_reminders;
  if (clean.includes('notification')) return data.notifications;
  return null;
};

// SQL-like query processor
const executeSql = (sql, params = []) => {
  const norm = sql.trim();
  const lower = norm.toLowerCase();

  // 1. ALTER TABLE / CREATE TABLE -> No-op for embedded JSON DB
  if (lower.startsWith('create table') || lower.startsWith('alter table')) {
    return { affectedRows: 0 };
  }

  // 2. SELECT COUNT(*) / SELECT COUNT(*) AS ...
  if (lower.startsWith('select count(')) {
    const tableMatch = lower.match(/from\s+([a-zA-Z0-9_`]+)/);
    if (!tableMatch) return [{ val: 0 }];
    const col = getCollection(tableMatch[1]);
    if (!col) return [{ val: 0 }];

    let filtered = [...col];
    let pIdx = 0;

    if (lower.includes('where')) {
      const wherePart = norm.substring(lower.indexOf('where') + 5);
      filtered = filtered.filter(item => {
        if (wherePart.includes("role = 'patient'")) return item.role === 'patient';
        if (wherePart.includes("role = 'doctor'")) return item.role === 'doctor';
        if (wherePart.includes("role = 'pharmacist'")) return item.role === 'pharmacist';
        if (wherePart.includes("role = 'admin'")) return item.role === 'admin';
        if (wherePart.includes('stock < 10')) return (item.stock || 0) < 10;
        if (wherePart.includes('is_verified = 1')) return item.is_verified === 1;
        if (wherePart.includes('is_verified = 0')) return !item.is_verified || item.is_verified === 0;
        if (wherePart.includes("status = 'pending'")) return item.status === 'pending' || item.status === 'processing';
        return true;
      });
    }

    const asMatch = lower.match(/as\s+([a-zA-Z0-9_]+)/);
    const key = asMatch ? asMatch[1] : 'val';

    if (lower.includes('sum(total_amount)')) {
      const sum = filtered.reduce((acc, row) => acc + (parseFloat(row.total_amount) || 0), 0);
      return [{ [key]: filtered.length, revenue: sum.toFixed(2), count: filtered.length }];
    }

    return [{ [key]: filtered.length, val: filtered.length, count: filtered.length }];
  }

  // 3. SELECT ... FROM table ...
  if (lower.startsWith('select')) {
    // Check for JOIN
    if (lower.includes('join users u on')) {
      if (lower.includes('from prescriptions')) {
        let results = data.prescriptions.map(p => {
          const user = data.users.find(u => u.id === p.patient_id) || {};
          return {
            ...p,
            patient_name: user.name || 'Unknown Patient',
            patient_email: user.email || ''
          };
        });
        results.sort((a, b) => new Date(b.date || b.uploaded_at) - new Date(a.date || a.uploaded_at));
        return results;
      }

      if (lower.includes('from side_effects')) {
        let results = data.side_effects.map(s => {
          const user = data.users.find(u => u.id === s.patient_id) || {};
          return {
            ...s,
            patient_name: user.name || 'Unknown Patient',
            patient_email: user.email || ''
          };
        });
        results.sort((a, b) => new Date(b.date_reported) - new Date(a.date_reported));
        return results;
      }

      if (lower.includes('from appointments a join users u on a.doctor_id = u.id')) {
        // Patient querying appointments with doctor name
        const pId = params[0];
        let results = data.appointments
          .filter(a => !pId || a.patient_id === pId)
          .map(a => {
            const doc = data.users.find(u => u.id === a.doctor_id) || {};
            return {
              ...a,
              doctor_name: doc.name || 'Doctor',
              doctor_email: doc.email || ''
            };
          });
        return results;
      }

      if (lower.includes('from appointments a join users u on a.patient_id = u.id')) {
        // Doctor querying appointments with patient name
        const dId = params[0];
        let results = data.appointments
          .filter(a => !dId || a.doctor_id === dId)
          .map(a => {
            const pat = data.users.find(u => u.id === a.patient_id) || {};
            return {
              ...a,
              patient_name: pat.name || 'Patient',
              patient_email: pat.email || ''
            };
          });
        return results;
      }

      if (lower.includes('from orders o join users u on o.patient_id = u.id')) {
        // Pharmacist querying all orders
        let results = data.orders.map(o => {
          const pat = data.users.find(u => u.id === o.patient_id) || {};
          return {
            ...o,
            patient_name: pat.name || 'Patient',
            patient_email: pat.email || ''
          };
        });
        results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        return results;
      }
    }

    // Standard SELECT from single table
    const tableMatch = lower.match(/from\s+([a-zA-Z0-9_`]+)/);
    if (!tableMatch) return [];
    const col = getCollection(tableMatch[1]);
    if (!col) return [];

    let filtered = [...col];
    let pIdx = 0;

    // Filter by WHERE clauses
    if (lower.includes('where')) {
      const whereClause = norm.substring(lower.indexOf('where') + 5);

      filtered = filtered.filter(item => {
        // Param matching
        if (whereClause.includes('email = ?')) {
          const target = (params[pIdx++] || '').toLowerCase().trim();
          return (item.email || '').toLowerCase().trim() === target;
        }
        if (whereClause.includes('role = ?')) {
          const targetRole = params[pIdx++];
          return item.role === targetRole;
        }
        if (whereClause.includes('patient_id = ?')) {
          const pId = params[pIdx++];
          return item.patient_id === pId;
        }
        if (whereClause.includes('user_id = ?')) {
          const uId = params[pIdx++];
          return item.user_id === uId;
        }
        if (whereClause.includes('doctor_id = ?')) {
          const dId = params[pIdx++];
          return item.doctor_id === dId;
        }
        if (whereClause.includes('id = ?')) {
          const id = params[pIdx++];
          return item.id == id;
        }
        if (whereClause.includes("role = 'doctor'")) {
          return item.role === 'doctor';
        }
        if (whereClause.includes("role = 'patient'")) {
          return item.role === 'patient';
        }
        if (whereClause.includes('category = ?')) {
          const cat = params[pIdx++];
          return item.category === cat;
        }
        if (whereClause.includes('name like ?') || whereClause.includes('`usage` like ?')) {
          const term = (params[0] || '').replace(/%/g, '').toLowerCase().trim();
          return (
            (item.name || '').toLowerCase().includes(term) ||
            (item.usage || '').toLowerCase().includes(term) ||
            (item.substitutes || '').toLowerCase().includes(term)
          );
        }
        return true;
      });
    }

    // Sorting
    if (lower.includes('order by')) {
      if (lower.includes('date desc') || lower.includes('created_at desc') || lower.includes('uploaded_at desc') || lower.includes('id desc')) {
        filtered.sort((a, b) => (b.id || 0) - (a.id || 0));
      } else if (lower.includes('name asc')) {
        filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      }
    }

    // Limit
    if (lower.includes('limit 1')) {
      return filtered.slice(0, 1);
    }
    if (lower.includes('limit 20')) {
      return filtered.slice(0, 20);
    }

    return filtered;
  }

  // 4. INSERT INTO table (...) VALUES (...)
  if (lower.startsWith('insert into')) {
    const tableMatch = lower.match(/insert into\s+([a-zA-Z0-9_`]+)/);
    if (!tableMatch) return { insertId: 0, affectedRows: 0 };
    const col = getCollection(tableMatch[1]);
    if (!col) return { insertId: 0, affectedRows: 0 };

    // Extract columns
    const colsMatch = norm.match(/\(([^)]+)\)\s+values/i);
    const newId = col.length > 0 ? Math.max(...col.map(x => x.id || 0)) + 1 : 1;
    const newRecord = { id: newId };

    if (colsMatch) {
      const colNames = colsMatch[1].split(',').map(c => c.trim().replace(/[`"']/g, ''));
      colNames.forEach((name, i) => {
        let val = params[i];
        if (val === 'curdate()' || val === 'CURDATE()') {
          val = new Date().toISOString().split('T')[0];
        }
        newRecord[name] = val;
      });
    }

    // Handle timestamps
    if (!newRecord.created_at) newRecord.created_at = new Date().toISOString();
    if (!newRecord.uploaded_at) newRecord.uploaded_at = new Date().toISOString();
    if (!newRecord.date_reported) newRecord.date_reported = new Date().toISOString().split('T')[0];

    // Check duplicate key update for medicines
    if (lower.includes('on duplicate key update') && newRecord.name) {
      const existing = col.find(m => (m.name || '').toLowerCase() === newRecord.name.toLowerCase());
      if (existing) {
        Object.assign(existing, newRecord);
        saveToDisk();
        return { insertId: existing.id, affectedRows: 1 };
      }
    }

    col.push(newRecord);
    saveToDisk();
    return { insertId: newId, affectedRows: 1 };
  }

  // 5. UPDATE table SET ... WHERE ...
  if (lower.startsWith('update')) {
    const tableMatch = lower.match(/update\s+([a-zA-Z0-9_`]+)/);
    if (!tableMatch) return { affectedRows: 0 };
    const col = getCollection(tableMatch[1]);
    if (!col) return { affectedRows: 0 };

    // Check expression updates
    let updatedCount = 0;

    // Toggle reminder
    if (lower.includes('is_taken = not is_taken')) {
      const id = params[0];
      const pId = params[1];
      const item = col.find(r => r.id == id && (!pId || r.patient_id == pId));
      if (item) {
        item.is_taken = item.is_taken ? 0 : 1;
        updatedCount = 1;
      }
    }
    // Update stock decrement
    else if (lower.includes('stock = greatest(0, stock - ?)')) {
      const qty = params[0];
      const name = params[1];
      const med = col.find(m => m.name === name);
      if (med) {
        med.stock = Math.max(0, (med.stock || 0) - qty);
        updatedCount = 1;
      }
    }
    // General update by ID
    else {
      // Find the ID in params or where clause
      const id = params[params.length - 1];
      const item = col.find(x => x.id == id);
      if (item) {
        if (lower.includes('is_verified = 1')) item.is_verified = 1;
        if (lower.includes('pharmacist_reply = ?')) item.pharmacist_reply = params[0];
        if (lower.includes('doctor_reply = ?')) {
          item.is_verified = 1;
          item.doctor_reply = params[0];
          if (params[1]) item.verified_by = params[1];
        }
        if (lower.includes('status = ?')) item.status = params[0];
        if (lower.includes('role = ?')) item.role = params[0];
        if (lower.includes('is_read = 1')) item.is_read = 1;
        if (lower.includes('clinical_notes = coalesce')) {
          if (params[0]) item.status = params[0];
          if (params[1]) item.clinical_notes = params[1];
        }
        updatedCount = 1;
      }
    }

    saveToDisk();
    return { affectedRows: updatedCount };
  }

  // 6. DELETE FROM table WHERE ...
  if (lower.startsWith('delete from')) {
    const tableMatch = lower.match(/delete from\s+([a-zA-Z0-9_`]+)/);
    if (!tableMatch) return { affectedRows: 0 };
    const col = getCollection(tableMatch[1]);
    if (!col) return { affectedRows: 0 };

    const id = params[0];
    const initialLen = col.length;
    const idx = col.findIndex(x => x.id == id);
    if (idx !== -1) {
      col.splice(idx, 1);
      saveToDisk();
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }

  return [];
};

// Database wrapper matching mysql2 connection interface
const db = {
  query: (sql, paramsOrCallback, maybeCallback) => {
    let params = [];
    let callback = null;

    if (typeof paramsOrCallback === 'function') {
      callback = paramsOrCallback;
    } else {
      params = paramsOrCallback || [];
      callback = maybeCallback;
    }

    try {
      const results = executeSql(sql, params);
      if (callback) {
        process.nextTick(() => callback(null, results));
      }
      return results;
    } catch (err) {
      console.error('Embedded DB Query Error:', err);
      if (callback) {
        process.nextTick(() => callback(err));
      }
    }
  },

  execute: function (...args) {
    return this.query(...args);
  }
};

module.exports = db;
