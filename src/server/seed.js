const db = require("./db"); // Import the connection pool
const { initializeDatabase } = require("./createTables");

const updatePlayerStats = async (player_id) => {
  try {
    const statsQuery = /*sql*/ `
        SELECT COUNT(*) AS total_games,
        SUM(score) AS total_score,
        MAX(score) AS high_score,
        AVG(score) AS average_score
        FROM games
        WHERE player_id = $1;
        `;
    const { rows } = await db.query(statsQuery, [player_id]);
    const { total_games, total_score, high_score, average_score } = rows[0];

    const handicap =
      average_score !== null ? Math.round(0.95 * (210 - average_score)) : 0;

    const updateQuery = /*sql*/ `
        UPDATE players
        SET total_games = $1, total_score = $2, high_score = $3, average_score = $4, handicap = $5
        WHERE player_id = $6;
        `;
    await db.query(updateQuery, [
      total_games,
      total_score,
      high_score,
      average_score,
      handicap,
      player_id,
    ]);

    console.log(
      `updated stats for player ${player_id}: total_games=${total_games}, total_score=${total_score}, high_score=${high_score}, average_score=${average_score}, handicap=${handicap}`
    );
  } catch (error) {
    console.error(`Error updating stats for player ${player_id}:`, error);
  }
};

const seedDatabase = async () => {
  try {
    await initializeDatabase();

    const teamsQuery = /*sql*/ `
  INSERT INTO teams (team_name) VALUES ('The Bowld and the Beautiful')
  ON CONFLICT (team_name) DO NOTHING
  RETURNING team_id;
  `;

    const teamResult = await db.query(teamsQuery);
    const teamId = teamResult.rows[0]?.team_id;
    console.log(`Team ID: ${teamId}`);

    // Directly insert players
    const playersQuery = /*sql*/ `
      INSERT INTO players (team_id, name) VALUES 
      ($1, 'Dash'), 
      ($1, 'Chloe'), 
      ($1, 'Courtney'), 
      ($1, 'Tray') 
      ON CONFLICT (name) DO NOTHING
      RETURNING player_id, name;
    `;
    const playersResult = await db.query(playersQuery, [teamId]);
    const players = playersResult.rows;
    console.log("Players seeded:", players);

    // Seed the games using the seeded players
    const gamesByWeek = [
      {
        week: "2024-09-03",
        games: [
          { player_id: players[0].player_id, score: 145 },
          { player_id: players[2].player_id, score: 137 },
          { player_id: players[3].player_id, score: 123 },
          { player_id: players[0].player_id, score: 140 },
          { player_id: players[2].player_id, score: 125 },
          { player_id: players[3].player_id, score: 114 },
          { player_id: players[0].player_id, score: 113 },
          { player_id: players[2].player_id, score: 159 },
          { player_id: players[3].player_id, score: 157 },
        ],
      },
      {
        week: "2024-09-10",
        games: [
          { player_id: players[0].player_id, score: 160 },
          { player_id: players[2].player_id, score: 149 },
          { player_id: players[3].player_id, score: 135 },
          { player_id: players[0].player_id, score: 182 },
          { player_id: players[2].player_id, score: 153 },
          { player_id: players[3].player_id, score: 104 },
          { player_id: players[0].player_id, score: 150 },
          { player_id: players[2].player_id, score: 140 },
          { player_id: players[3].player_id, score: 130 },
        ],
      },
      {
        week: "2024-09-17",
        games: [
          { player_id: players[0].player_id, score: 113 },
          { player_id: players[1].player_id, score: 116 },
          { player_id: players[2].player_id, score: 155 },
          { player_id: players[3].player_id, score: 173 },
          { player_id: players[0].player_id, score: 176 },
          { player_id: players[1].player_id, score: 100 },
          { player_id: players[2].player_id, score: 150 },
          { player_id: players[3].player_id, score: 211 },
          { player_id: players[0].player_id, score: 128 },
          { player_id: players[1].player_id, score: 139 },
          { player_id: players[2].player_id, score: 147 },
          { player_id: players[3].player_id, score: 209 },
        ],
      },
      {
        week: "2024-09-24",
        games: [
          { player_id: players[0].player_id, score: 137 },
          { player_id: players[1].player_id, score: 130 },
          { player_id: players[2].player_id, score: 164 },
          { player_id: players[3].player_id, score: 171 },
          { player_id: players[0].player_id, score: 110 },
          { player_id: players[1].player_id, score: 133 },
          { player_id: players[2].player_id, score: 138 },
          { player_id: players[3].player_id, score: 172 },
          { player_id: players[0].player_id, score: 117 },
          { player_id: players[1].player_id, score: 147 },
          { player_id: players[2].player_id, score: 153 },
          { player_id: players[3].player_id, score: 139 },
        ],
      },
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
          { player_id: players[1].player_id, score: 128 },
          { player_id: players[2].player_id, score: 131 },
          { player_id: players[3].player_id, score: 141 },

          { player_id: players[1].player_id, score: 138 },
          { player_id: players[2].player_id, score: 109 },
          { player_id: players[3].player_id, score: 133 },

          { player_id: players[1].player_id, score: 125 },
          { player_id: players[2].player_id, score: 105 },
          { player_id: players[3].player_id, score: 139 },
        ],
      },

      {
        week: "2024-10-15",
        games: [
          { player_id: players[0].player_id, score: 159 },
          { player_id: players[1].player_id, score: 113 },
          { player_id: players[2].player_id, score: 120 },
          { player_id: players[3].player_id, score: 161 },
          { player_id: players[0].player_id, score: 128 },
          { player_id: players[1].player_id, score: 145 },
          { player_id: players[2].player_id, score: 139 },
          { player_id: players[3].player_id, score: 148 },
          { player_id: players[0].player_id, score: 130 },
          { player_id: players[1].player_id, score: 122 },
          { player_id: players[2].player_id, score: 144 },
          { player_id: players[3].player_id, score: 137 },
        ],
      },

      {
        week: "2024-10-22",
        games: [
          { player_id: players[0].player_id, score: 129 },
          { player_id: players[1].player_id, score: 108 },
          { player_id: players[2].player_id, score: 138 },
          { player_id: players[3].player_id, score: 189 },
          { player_id: players[0].player_id, score: 121 },
          { player_id: players[1].player_id, score: 136 },
          { player_id: players[2].player_id, score: 120 },
          { player_id: players[3].player_id, score: 163 },
          { player_id: players[0].player_id, score: 136 },
          { player_id: players[1].player_id, score: 124 },
          { player_id: players[2].player_id, score: 159 },
          { player_id: players[3].player_id, score: 169 },
        ],
      },
      // add more weeks here following the same structure
    ];

    for (const week of gamesByWeek) {
      for (const game of week.games) {
        const insertGameQuery = /*sql*/ `
          INSERT INTO games (player_id, score, week)
          VALUES ($1, $2, $3)
       
          `;
        await db.query(insertGameQuery, [
          game.player_id,
          game.score,
          week.week,
        ]);
      }
    }

    for (const player of players) {
      await updatePlayerStats(player.player_id);
    }

    console.log("All games seeded and player stats updated.");
  } catch (err) {
    console.error("Error seeding the database:", err);
  }
};

seedDatabase()
  .then(() => {
    console.log("database seeding completed.");
    db.end();
  })
  .catch((error) => {
    console.error("Error during database seeding:", error);
    db.end();
  });

//     // Check if players already exist
//     const playersResult = await pool.query(
//       /*sql*/ `
//       SELECT player_id, name FROM players WHERE team_id = $1;
//     `,
//       [teamId]
//     );

//     let players = [];

//     if (playersResult.rows.length === 4) {
//       // Players already exist, use the existing players
//       players = playersResult.rows;
//       console.log("Players already exist:", players);
//     } else {
//       // Insert the players if they don't exist
//       const playerNames = ["Dash", "Chloe", "Courtney", "Tray"];
//       const playerInsertValues = playerNames
//         .map((name) => `('${name}', ${teamId})`)
//         .join(", ");

//       const newPlayers = await pool.query(/*sql*/ `
//         INSERT INTO players (name, team_id) VALUES ${playerInsertValues} RETURNING player_id, name;
//       `);
//       players = newPlayers.rows;
//       console.log("New players created:", players);
//     }

//     // Seed the games using the existing players
//     await seedGames(players);

//     console.log("Database seeded successfully!");
//   } catch (err) {
//     console.error("Error seeding the database:", err);
//   } finally {
//     try {
//       await pool.end(); // Close the pool connection after seeding
//     } catch (closeErr) {
//       console.error("Error closing the pool:", closeErr);
//     }
//   }
// };

// seedDatabase();
