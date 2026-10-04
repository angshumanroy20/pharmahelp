const db = require('../models/db');

// Get all medicines with optional category and search filters
exports.getAllMedicines = (req, res) => {
  const { category, search } = req.query;

  let sql = 'SELECT * FROM medicines WHERE 1=1';
  const params = [];

  if (category && category !== 'All') {
    sql += ' AND category = ?';
    params.push(category);
  }

  if (search && search.trim() !== '') {
    sql += ' AND (name LIKE ? OR `usage` LIKE ? OR substitutes LIKE ?)';
    const term = `%${search.trim()}%`;
    params.push(term, term, term);
  }

  sql += ' ORDER BY name ASC';

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching medicines', error: err.message });
    res.json(results);
  });
};

// Search medicines
exports.searchMedicine = (req, res) => {
  const search = req.query.q || '';

  if (!search || search.trim() === '') {
    return exports.getAllMedicines(req, res);
  }

  const sql = 'SELECT * FROM medicines WHERE name LIKE ? OR `usage` LIKE ? OR substitutes LIKE ? ORDER BY name ASC';
  const term = `%${search.trim()}%`;

  db.query(sql, [term, term, term], (err, results) => {
    if (err) return res.status(500).json({ message: 'Search failed', error: err.message });
    res.json(results);
  });
};

// Add or Update Medicine (Pharmacist/Admin)
exports.addOrUpdateMedicine = (req, res) => {
  const { name, usage, stock, substitutes, category, price, manufacturer, dosage_form, requires_prescription } = req.body;

  if (!name || stock === undefined) {
    return res.status(400).json({ message: 'Medicine name and stock are required' });
  }

  const sql = `
    INSERT INTO medicines (name, \`usage\`, stock, substitutes, category, price, manufacturer, dosage_form, requires_prescription)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      \`usage\` = VALUES(\`usage\`),
      stock = VALUES(stock),
      substitutes = VALUES(substitutes),
      category = VALUES(category),
      price = VALUES(price),
      manufacturer = VALUES(manufacturer),
      dosage_form = VALUES(dosage_form),
      requires_prescription = VALUES(requires_prescription)
  `;

  const values = [
    name,
    usage || 'General healthcare',
    parseInt(stock) || 0,
    substitutes || 'None',
    category || 'General',
    parseFloat(price) || 10.00,
    manufacturer || 'PharmaCore Labs',
    dosage_form || 'Tablet',
    requires_prescription ? 1 : 0
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error saving medicine:', err);
      return res.status(500).json({ message: 'Failed to save medicine', error: err.message });
    }
    res.json({ message: 'Medicine saved successfully' });
  });
};

// Delete Medicine (Pharmacist/Admin)
exports.deleteMedicine = (req, res) => {
  if (req.user.role !== 'pharmacist' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const { id } = req.params;
  db.query('DELETE FROM medicines WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ message: 'Failed to delete medicine', error: err.message });
    res.json({ message: 'Medicine deleted successfully' });
  });
};
