const pool = require("./db");

const seedData = async () => {
  try {
    // Insert some sample teams
    const teamsQuery = /*sql*/ `
        INSERT INTO teams (team_name) VALUES 
        ('The Bowld and the Beautiful') 
        RETURNING *;
      `;
    const teamsResult = await pool.query(teamsQuery);
    console.log("Teams seeded:", teamsResult.rows);

    // Insert some sample players
    const playersQuery = /*sql*/ `
        INSERT INTO players (team_id, name, total_games, total_score, high_score, average_score, handicap) VALUES 
        (${teamsResult.rows[0].team_id}, 'Dash', 12, 1671, 182, 139, 67), 
        (${teamsResult.rows[0].team_id}, 'Chloe', 6, 765, 147, 124, 81), 
        (${teamsResult.rows[0].team_id}, 'Courtney', 12, 1770, 164, 147, 59),
        (${teamsResult.rows[0].team_id}, 'Tray', 12, 1838, 211, 153, 54) 
        RETURNING *;
      `;
    const playersResult = await pool.query(playersQuery);
    console.log("Players seeded:", playersResult.rows);

    // Insert some sample games
    const gamesQuery = `
        INSERT INTO games (player_id, score, game_date) VALUES 
        (${playersResult.rows[0].player_id}, 170, '2024-09-01'),
        (${playersResult.rows[1].player_id}, 160, '2024-09-02'),
        (${playersResult.rows[2].player_id}, 180, '2024-09-03')
        RETURNING *;
      `;
    const gamesResult = await pool.query(gamesQuery);
    console.log("Games seeded:", gamesResult.rows);
  } catch (err) {
    console.error("Error seeding data:", err);
  } finally {
    pool.end(); // Close the pool connection after the seeding is done
  }
};

seedData();
