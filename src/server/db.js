const { Pool } = require("pg");

const pool = new Pool({
  user: "spastic277", // PostgreSQL username
  host: "localhost", // Database host (local or remote)
  database: "bowling_stats", // Name of your database
  password: "Iloveoscar123", // Password for the database user
  port: 5432, // Default PostgreSQL port
});

module.exports = pool;
