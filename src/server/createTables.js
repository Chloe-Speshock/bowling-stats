const pool = require("./db"); // Import the connection pool

const dropTables = async () => {
  try {
    await pool.query(/*sql*/ `
        DROP TABLE IF EXISTS games CASCADE;
        DROP TABLE IF EXISTS players CASCADE;
        DROP TABLE IF EXISTS teams CASCADE;
      `);
    console.log("Tables dropped successfully (if they existed)!");
  } catch (err) {
    console.error("Error dropping tables:", err);
  }
};

const createTables = async () => {
  try {
    await pool.query(/*sql*/ `
      CREATE TABLE IF NOT EXISTS teams (
        team_id SERIAL PRIMARY KEY,
        team_name VARCHAR(100) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS players (
        player_id SERIAL PRIMARY KEY,
        team_id INT REFERENCES teams(team_id),
        name VARCHAR(100) NOT NULL,
        total_games INT DEFAULT 0,
        total_score INT DEFAULT 0,
        high_score INT DEFAULT 0,
        average_score DECIMAL DEFAULT 0.0,
        handicap DECIMAL DEFAULT 0.0
      );

      CREATE TABLE IF NOT EXISTS games (
        game_id SERIAL PRIMARY KEY,
        player_id INT REFERENCES players(player_id),
        score INT NOT NULL,
        game_date DATE DEFAULT CURRENT_DATE
      );
    `);

    console.log("Tables created successfully!");
  } catch (err) {
    console.error("Error creating tables:", err);
  } finally {
    try {
      await pool.end(); // Close the pool connection after executing the queries
    } catch (closeErr) {
      console.error("error closing the pool:", closeErr);
    }
  }
};

// Call the function to create tables
const initializeDatabase = async () => {
  try {
    await dropTables();
    await createTables();
  } catch (err) {
    console.error("database initialization failed:", err);
  }
};

initializeDatabase();
