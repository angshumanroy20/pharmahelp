const dotenv = require("dotenv");
const path = require("path");

// Load .env from root or backend
dotenv.config({ path: path.join(__dirname, "../../.env") });
dotenv.config();

const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "pharmacy",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ MySQL Pool Connection Error:", err.message);
  } else {
    console.log("✅ MySQL Pool connected successfully to database:", process.env.DB_NAME || "pharmacy");
    connection.release();
  }
});

module.exports = pool;
