const createTables = require("./createTables");
const pool = require("./db"); // Import the connection pool
const seedGames = require("./seedGames"); // Import the game seeding function

const seedDatabase = async () => {
  try {
    await createTables();

    const teamsQuery = /*sql*/ `
  INSERT INTO teams (team_name) VALUES ('The Bowld and the Beautiful')
  RETURNING team_id;
  `;

    const teamResult = await pool.query(teamsQuery);
    const teamId = teamResult.rows[0].team_id;
    console.log(`Team created: ${teamId}`);

    // Directly insert players
    const playersQuery = /*sql*/ `
      INSERT INTO players (team_id, name) VALUES 
      ($1, 'Dash'), 
      ($1, 'Chloe'), 
      ($1, 'Courtney'), 
      ($1, 'Tray') 
      RETURNING *;
    `;
    const playersResult = await pool.query(playersQuery, [teamId]);
    const players = playersResult.rows;
    console.log("Players seeded:", players);

    // Seed the games using the seeded players
    await seedGames(players);

    console.log("Database seeded successfully!");
  } catch (err) {
    console.error("Error seeding the database:", err);
  } finally {
    await pool.end(); // Close the pool connection after seeding
    console.log("database connection closed");
  }
};

seedDatabase();

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
