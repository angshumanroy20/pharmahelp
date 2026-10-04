const dotenv = require("dotenv");
const path = require("path");

// Load .env from root or backend
dotenv.config({ path: path.join(__dirname, "../../.env") });
dotenv.config();

const mysql = require("mysql2");

let poolConfig = {};

if (process.env.DATABASE_URL) {
  // Cloud providers providing a single URI (e.g. mysql://user:pass@host:port/dbname)
  poolConfig = {
    uri: process.env.DATABASE_URL,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: process.env.DB_SSL === 'false' ? undefined : { rejectUnauthorized: false }
  };
} else {
  poolConfig = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "root",
    database: process.env.DB_NAME || "pharmacy",
    port: parseInt(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
  };
}

const pool = mysql.createPool(poolConfig);

pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ MySQL Pool Connection Error:", err.message);
  } else {
    console.log("✅ MySQL Pool connected successfully to database:", process.env.DB_NAME || "pharmacy");
    connection.release();
  }
});

module.exports = pool;
