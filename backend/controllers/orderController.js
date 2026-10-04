const db = require('../models/db');

// Patient: Create a new order
exports.createOrder = (req, res) => {
  const patientId = req.user.id;
  const { items, deliveryAddress, paymentMethod, notes } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  let total = 0;
  items.forEach(item => {
    total += (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 1);
  });

  const itemsJson = JSON.stringify(items);
  const address = deliveryAddress || 'Home Address On File';
  const method = paymentMethod || 'Cash on Delivery';

  const insertSql = `
    INSERT INTO orders (patient_id, items, total_amount, delivery_address, payment_method, notes, status)
    VALUES (?, ?, ?, ?, ?, ?, 'processing')
  `;

  db.query(insertSql, [patientId, itemsJson, total, address, method, notes || null], (err, result) => {
    if (err) {
      console.error('Order creation error:', err);
      return res.status(500).json({ message: 'Failed to place order', error: err.message });
    }

    const orderId = result.insertId;

    // Decrement stock for each item if stock exists
    items.forEach(item => {
      if (item.name && item.quantity) {
        db.query(
          'UPDATE medicines SET stock = GREATEST(0, stock - ?) WHERE name = ?',
          [item.quantity, item.name],
          (stockErr) => {
            if (stockErr) console.warn('Could not update stock for', item.name);
          }
        );
      }
    });

    // Create notification
    db.query(
      `INSERT INTO notifications (user_id, title, message, type)
       VALUES (?, ?, ?, 'order')`,
      [patientId, 'Order Placed Successfully', `Your order #${orderId} of $${total.toFixed(2)} is being processed by the pharmacy.`]
    );

    res.status(201).json({
      message: 'Order placed successfully',
      orderId,
      totalAmount: total,
      status: 'processing'
    });
  });
};

// Patient: Get own orders
exports.getMyOrders = (req, res) => {
  const patientId = req.user.id;

  const sql = `
    SELECT id, items, total_amount, delivery_address, payment_method, status, notes, created_at
    FROM orders
    WHERE patient_id = ?
    ORDER BY created_at DESC
  `;

  db.query(sql, [patientId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching orders', error: err.message });

    const formatted = results.map(row => {
      let parsedItems = [];
      try {
        parsedItems = typeof row.items === 'string' ? JSON.parse(row.items) : row.items;
      } catch (e) {
        parsedItems = [];
      }
      return { ...row, items: parsedItems };
    });

    res.json({ orders: formatted });
  });
};

// Pharmacist / Admin: Get all orders
exports.getAllOrders = (req, res) => {
  if (req.user.role !== 'pharmacist' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const sql = `
    SELECT o.id, o.patient_id, u.name AS patient_name, u.email AS patient_email,
           o.items, o.total_amount, o.delivery_address, o.payment_method, o.status, o.notes, o.created_at
    FROM orders o
    JOIN users u ON o.patient_id = u.id
    ORDER BY o.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching all orders', error: err.message });

    const formatted = results.map(row => {
      let parsedItems = [];
      try {
        parsedItems = typeof row.items === 'string' ? JSON.parse(row.items) : row.items;
      } catch (e) {
        parsedItems = [];
      }
      return { ...row, items: parsedItems };
    });

    res.json({ orders: formatted });
  });
};

// Pharmacist / Admin: Update order status
exports.updateOrderStatus = (req, res) => {
  if (req.user.role !== 'pharmacist' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'processing', 'ready', 'dispatched', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  db.query('UPDATE orders SET status = ? WHERE id = ?', [status, id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Failed to update order', error: err.message });

    // Send notification to patient
    db.query('SELECT patient_id FROM orders WHERE id = ?', [id], (err2, rows) => {
      if (!err2 && rows.length > 0) {
        const patientId = rows[0].patient_id;
        db.query(
          `INSERT INTO notifications (user_id, title, message, type)
           VALUES (?, ?, ?, 'order')`,
          [patientId, 'Order Status Updated', `Your order #${id} status is now: ${status.toUpperCase()}.`]
        );
      }
    });

    res.json({ message: `Order #${id} updated to ${status}` });
  });
};
