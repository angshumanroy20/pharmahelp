// const db = require('../models/db');

// // exports.getAllMedicines = (req, res) => {
// //   db.query('SELECT * FROM medicines', (err, results) => {
// //     if (err) return res.status(500).json({ error: err });
// //     res.json(results);
// //   });
// // };

// // exports.searchMedicine = (req, res) => {
// //   const search = req.query.q;
// //   db.query(
// //     'SELECT * FROM medicines WHERE name LIKE ?',
// //     [`%${search}%`],
// //     (err, results) => {
// //       if (err) return res.status(500).json({ error: err });
// //       res.json(results);
// //     }
// //   );
// // };

// // exports.addMedicine = (req, res) => {
// //   const { name, description, usage, stock, substitutes } = req.body;
// //   db.query(
// //     'INSERT INTO medicines (name, description, usage, stock, substitutes) VALUES (?, ?, ?, ?, ?)',
// //     [name, description, usage, stock || 0, substitutes || null],
// //     (err) => {
// //       if (err) return res.status(500).json({ error: err });
// //       res.status(201).json({ message: 'Medicine added successfully' });
// //     }
// //   );
// // };


// exports.getAllMedicines = (req, res) => {
//   db.query('SELECT * FROM medicines', (err, results) => {
//     if (err) return res.status(500).json({ error: err });
//     res.json(results);
//   });
// };

// // exports.searchMedicine = (req, res) => {
// //   const search = req.query.q;
// //   db.query(
// //     'SELECT * FROM medicines WHERE name LIKE ?',
// //     [`%${search}%`],
// //     (err, results) => {
// //       if (err) return res.status(500).json({ error: err });
// //       res.json(results);
// //     }
// //   );
// // };


// exports.searchMedicine = (req, res) => {
//   const search = req.query.q;

//   if (!search || search.trim() === '') {
//     return res.status(400).json({ message: 'Search query cannot be empty' });
//   }

//   const sql = 'SELECT * FROM medicines WHERE name LIKE ?';
//   const values = [`%${search}%`];

//   db.query(sql, values, (err, results) => {
//     if (err) return res.status(500).json({ error: err });
//     res.json(results);
//   });
// };


// exports.addMedicine = (req, res) => {
//   const { name, usage, stock, substitutes } = req.body;
//   db.query(
//     'INSERT INTO medicines (name,  usage, stock, substitutes) VALUES (?, ?, ?, ?)',
//     [name, usage, stock || 0, substitutes || null],
//     (err) => {
//       if (err) return res.status(500).json({ error: err });
//       res.status(201).json({ message: 'Medicine added successfully' });
//     }
//   );
// };




// // Get all medicines or search by name
// exports.getMedicines = (req, res) => {
//   const search = req.query.search || '';
//   db.query(
//     'SELECT * FROM medicines WHERE name LIKE ?',
//     [`%${search}%`],
//     (err, results) => {
//       if (err) return res.status(500).json({ error: err });
//       res.json(results);
//     }
//   );
// };

// // Admin: Add or update a medicine
// exports.addOrUpdateMedicine = (req, res) => {
//   const { name, usage, stock, substitutes } = req.body;

//   if (!name || !usage || stock === undefined) {
//     return res.status(400).json({ message: 'Missing required fields' });
//   }

//   const sql = `
//     INSERT INTO medicines (name, usage, stock, substitutes)
//     VALUES (?, ?, ?, ?)
//     ON DUPLICATE KEY UPDATE
//       usage = VALUES(usage),
//       stock = VALUES(stock),
//       substitutes = VALUES(substitutes)
//   `;

//   db.query(sql, [name, usage, stock, substitutes], (err) => {
//     if (err) {
//       console.error('Error saving medicine:', err);
//       return res.status(500).json({ error: 'Failed to save medicine' });
//     }
//     res.status(200).json({ message: 'Medicine saved successfully' });
//   });
// };



// // GET all medicines
// exports.getAllMedicines = (req, res) => {
//   db.query('SELECT * FROM medicines', (err, results) => {
//     if (err) return res.status(500).json({ error: err });
//     res.json(results);
//   });
// };

// // POST to save or update medicine
// exports.saveMedicine = (req, res) => {
//   const { name, usage, stock, substitutes } = req.body;

//   // Check if medicine already exists
//   db.query('SELECT * FROM medicines WHERE name = ?', [name], (err, results) => {
//     if (err) return res.status(500).json({ error: err });

//     if (results.length > 0) {
//       // Update existing
//       db.query(
//         'UPDATE medicines SET usage=?, stock=?, substitutes=? WHERE name=?',
//         [usage, stock, substitutes, name],
//         (err2) => {
//           if (err2) return res.status(500).json({ error: err2 });
//           res.json({ message: 'Medicine updated successfully' });
//         }
//       );
//     } else {
//       // Insert new
//       db.query(
//         'INSERT INTO medicines (name, usage, stock, substitutes) VALUES (?, ?, ?, ?)',
//         [name, usage, stock, substitutes],
//         (err3) => {
//           if (err3) return res.status(500).json({ error: err3 });
//           res.json({ message: 'Medicine added successfully' });
//         }
//       );
//     }
//   });
// };




// main file---->

const db = require('../models/db');

// Get all medicines
exports.getAllMedicines = (req, res) => {
  db.query('SELECT * FROM medicines', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Search medicines by name
exports.searchMedicine = (req, res) => {
  const search = req.query.q;

  if (!search || search.trim() === '') {
    return res.status(400).json({ message: 'Search query cannot be empty' });
  }

  const sql = 'SELECT * FROM medicines WHERE name LIKE ?';
  const values = [`%${search}%`];

  db.query(sql, values, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Add or Update Medicine
// exports.addOrUpdateMedicine = (req, res) => {
//   const { name, usage, stock, substitutes } = req.body;

//   if (!name || !usage || stock === undefined) {
//     return res.status(400).json({ message: 'Missing required fields' });
//   }
//   console.log("Received data:", { name, usage, stock, substitutes });
//   console.log("Running SQL INSERT/UPDATE...");

//   const sql = `
//     INSERT INTO medicines (name, usage, stock, substitutes)
//     VALUES (?, ?, ?, ?)
//     ON DUPLICATE KEY UPDATE
//       usage = VALUES(usage),
//       stock = VALUES(stock),
//       substitutes = VALUES(substitutes)
//   `;

//   db.query(sql, [name, usage, stock, substitutes], (err) => {
//     // if (err) {
//     //   console.error('Error saving medicine:', err);
//     //   return res.status(500).json({ error: 'Failed to save medicine' });
//     // }
//     if (err) {
//       console.error('Error saving medicine:', err);
//       return res.status(500).json({ error: err.message });
//     }
    
//     res.status(200).json({ message: 'Medicine saved successfully' });
//   });
// };

exports.addOrUpdateMedicine = (req, res) => {
  console.log("🧪 Received POST /save with body:", req.body);

  const { name, usage, stock, substitutes } = req.body;

  if (!name || !usage || stock === undefined) {
    console.log("Missing fields:", req.body);
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const sql = `
    INSERT INTO medicines (name, \`usage\`, stock, substitutes)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      \`usage\` = VALUES(\`usage\`),
      stock = VALUES(stock),
      substitutes = VALUES(substitutes)
  `;

  db.query(sql, [name, usage, stock, substitutes], (err, result) => {
    if (err) {
      console.error('❌ Error saving medicine:', err); // This should now show in your terminal
      return res.status(500).json({ error: 'Failed to save medicine' });
    }

    console.log("Medicine saved:", result);
    res.status(200).json({ message: 'Medicine saved successfully' });
  });
};







// Save new or update existing medicine
exports.saveMedicine = (req, res) => {
  const { name, usage, stock, substitutes } = req.body;

  if (!name || !usage || stock === undefined) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  db.query('SELECT * FROM medicines WHERE name = ?', [name], (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (results.length > 0) {
      // Medicine exists, update it
      db.query(
        'UPDATE medicines SET usage=?, stock=?, substitutes=? WHERE name=?',
        [usage, stock, substitutes, name],
        (err2) => {
          if (err2) return res.status(500).json({ error: err2 });
          res.json({ message: 'Medicine updated successfully' });
        }
      );
    } else {
      // Insert new medicine
      db.query(
        'INSERT INTO medicines (name, usage, stock, substitutes) VALUES (?, ?, ?, ?)',
        [name, usage, stock, substitutes],
        (err3) => {
          if (err3) return res.status(500).json({ error: err3 });
          res.json({ message: 'Medicine added successfully' });
        }
      );
    }
  });
};
