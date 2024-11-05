const db = require("./db"); // Import the connection pool

const dropTables = async () => {
  try {
    await db.query(`
DROP TABLE IF EXISTS games CASCADE;
DROP TABLE IF EXISTS players CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP SEQUENCE IF EXISTS teams_team_id_seq CASCADE;
DROP SEQUENCE IF EXISTS players_player_id_seq CASCADE;
DROP SEQUENCE IF EXISTS games_game_id_seq CASCADE;
`);
    console.log("Tables and sequences dropped successfully.");
  } catch (error) {
    console.error("Error dropping tables and sequences:", error);
    throw error;
  }
};

const createTables = async () => {
  try {
    await db.query(/*sql*/ `
    CREATE TABLE IF NOT EXISTS teams (
        team_id SERIAL PRIMARY KEY,
        team_name VARCHAR(100) UNIQUE NOT NULL
    );
      `);

    await db.query(/*sql*/ `
      CREATE TABLE IF NOT EXISTS players (
        player_id SERIAL PRIMARY KEY,
        team_id INTEGER REFERENCES teams(team_id) ON DELETE CASCADE,
        name VARCHAR(100) UNIQUE NOT NULL,
        total_games INTEGER DEFAULT 0,
        total_score INTEGER DEFAULT 0,
        high_score INTEGER DEFAULT 0,
        average_score NUMERIC(5,2) DEFAULT 0,
        handicap NUMERIC(5,2) DEFAULT 0
      );
      `);
    await db.query(/*sql*/ `
      CREATE TABLE IF NOT EXISTS games (
        player_id INT,
        score INT NOT NULL,
        game_date DATE NOT NULL,
        game_number INT,
        PRIMARY KEY (player_id, game_date, game_number)
      );
    `);

    console.log("Tables created successfully!");
  } catch (err) {
    console.error("Error creating tables:", err);
    throw err;
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

// initializeDatabase();

module.exports = {
  createTables,
  initializeDatabase,
};
