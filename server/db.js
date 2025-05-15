const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  // host: process.env.PG_HOST,
  // port: process.env.PG_PORT,
  // user: process.env.PG_USER,
  // password: process.env.PG_PASSWORD,
  // database: process.env.PG_DATABASE,
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

module.exports = pool;
