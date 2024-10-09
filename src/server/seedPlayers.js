const pool = require("./db"); // Import the connection pool

const seedPlayers = async () => {
  try {
    const teamsQuery = /*sql*/ `
        INSERT INTO teams (team_name) VALUES 
        ('The Bowld and the Beautiful') 
        RETURNING *;
      `;
    const teamsResult = await pool.query(teamsQuery);
    console.log("Teams seeded:", teamsResult.rows);

    const playersQuery = /*sql*/ `
        INSERT INTO players (team_id, name) VALUES 
        (${teamsResult.rows[0].team_id}, 'Dash'), 
        (${teamsResult.rows[0].team_id}, 'Chloe'), 
        (${teamsResult.rows[0].team_id}, 'Courtney'),
        (${teamsResult.rows[0].team_id}, 'Tray') 
        RETURNING *;
      `;
    const playersResult = await pool.query(playersQuery);
    console.log("Players seeded:", playersResult.rows);

    return playersResult.rows; // Return the seeded players to use them in games
  } catch (err) {
    console.error("Error seeding players:", err);
  }
};

module.exports = seedPlayers;
