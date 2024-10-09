const pool = require("./db"); // Import the connection pool

const seedGames = async (players) => {
  try {
    // Games separated by weeks for each player
    const gamesByWeek = [
      {
        week: "2024-10-01",
        games: [
          { player_id: players[0].player_id, score: 122 },
          { player_id: players[1].player_id, score: 109 },
          { player_id: players[2].player_id, score: 147 },
          { player_id: players[3].player_id, score: 160 },
          { player_id: players[0].player_id, score: 129 },
          { player_id: players[1].player_id, score: 163 },
          { player_id: players[2].player_id, score: 186 },
          { player_id: players[3].player_id, score: 166 },
          { player_id: players[0].player_id, score: 154 },
          { player_id: players[1].player_id, score: 151 },
          { player_id: players[2].player_id, score: 135 },
          { player_id: players[3].player_id, score: 158 },
        ],
      },
      {
        week: "2024-10-08",
        games: [
          { player_id: players[0].player_id, score: 128 },
          { player_id: players[1].player_id, score: 128 },
          { player_id: players[2].player_id, score: 131 },
          { player_id: players[3].player_id, score: 141 },
          { player_id: players[0].player_id, score: 128 },
          { player_id: players[1].player_id, score: 138 },
          { player_id: players[2].player_id, score: 109 },
          { player_id: players[3].player_id, score: 133 },
          { player_id: players[0].player_id, score: 128 },
          { player_id: players[1].player_id, score: 125 },
          { player_id: players[2].player_id, score: 105 },
          { player_id: players[3].player_id, score: 139 },
        ],
      },

      // add more weeks here following the same structure
    ];

    // Loop through each week's data and insert the games into the database
    for (const week of gamesByWeek) {
      console.log(`seeding games for week: ${week.week}`);

      for (const game of week.games) {
        if (!game.player_id) {
          throw new Error(`Player ID is undefined for one of the games!`);
        }
      }
      const existingGamesQuery = `
      SELECT COUNT(*) FROM games WHERE game_date = '${
        week.week
      }' AND player_id IN (${week.games
        .map((game) => game.player_id)
        .join(", ")});
    `;
      const existingGamesResult = await pool.query(existingGamesQuery);
      const existingGamesCount = parseInt(
        existingGamesResult.rows[0].count,
        10
      );

      // Only insert games if none exist for this week
      if (existingGamesCount === 0) {
        const gamesQuery = `
        INSERT INTO games (player_id, score, game_date) VALUES
        ${week.games
          .map((game) => `(${game.player_id}, ${game.score}, '${week.week}')`)
          .join(", ")}
        RETURNING *;
      `;
        const gamesResult = await pool.query(gamesQuery);
        console.log(`Games for week ${week.week} seeded:`, gamesResult.rows);
      } else {
        console.log(
          `games for week ${week.week} already exist. Skipping insert.`
        );
      }
    }
  } catch (err) {
    console.error("Error seeding games:", err);
  }
};

module.exports = seedGames;
