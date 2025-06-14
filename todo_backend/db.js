const { Pool } = require('pg');

const pool = new Pool({
  user: 'Admin',      // e.g., 'postgres'
  host: 'localhost',                   // usually 'localhost'
  database: 'tododb',                  // the name you used earlier
  password: '',  // the password you set up
  port: 5432,                          // default PostgreSQL port
});

module.exports = pool;