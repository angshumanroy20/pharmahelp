const dotenv = require("dotenv");
const path = require("path");

// Load .env
dotenv.config({ path: path.join(__dirname, "../../.env") });
dotenv.config();

const embeddedDb = require("./embeddedDb");

// If DB_DRIVER is explicitly 'embedded', or no external MySQL is configured, use embedded database
const forceEmbedded = process.env.DB_DRIVER === 'embedded' || 
                      process.env.USE_EMBEDDED_DB === 'true' ||
                      !process.env.DB_HOST;

if (forceEmbedded) {
  console.log("⚡ Using Self-Contained Embedded Database (Zero Cloud Hosting Needed). Stored in /backend/data/pharmahelp_db.json");
  module.exports = embeddedDb;
} else {
  // Attempt MySQL connection if user provided external credentials
  try {
    const mysql = require("mysql2");

    const poolConfig = process.env.DATABASE_URL
      ? {
          uri: process.env.DATABASE_URL,
          waitForConnections: true,
          connectionLimit: 10,
          ssl: process.env.DB_SSL === 'false' ? undefined : { rejectUnauthorized: false }
        }
      : {
          host: process.env.DB_HOST || "localhost",
          user: process.env.DB_USER || "root",
          password: process.env.DB_PASSWORD || "root",
          database: process.env.DB_NAME || "pharmacy",
          port: parseInt(process.env.DB_PORT) || 3306,
          waitForConnections: true,
          connectionLimit: 10,
          ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
        };

    const pool = mysql.createPool(poolConfig);

    pool.getConnection((err, connection) => {
      if (err) {
        console.warn("⚠️ MySQL not reachable (" + err.message + "). Seamlessly falling back to Self-Contained Embedded Database!");
      } else {
        console.log("✅ MySQL Pool connected successfully to database:", process.env.DB_NAME || "pharmacy");
        connection.release();
      }
    });

    // Smart proxy: if pool errors, delegate to embeddedDb
    const hybridDb = {
      query: (sql, params, cb) => {
        pool.query(sql, params, (err, res) => {
          if (err && (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND' || err.code === 'ETIMEDOUT')) {
            console.warn('⚠️ Cloud MySQL unavailable, executing query on Embedded Database');
            return embeddedDb.query(sql, params, cb);
          }
          if (cb) cb(err, res);
        });
      },
      execute: function (...args) {
        return this.query(...args);
      }
    };

    module.exports = hybridDb;
  } catch (e) {
    console.warn("⚠️ Failed to load MySQL module, using Self-Contained Embedded Database.");
    module.exports = embeddedDb;
  }
}
