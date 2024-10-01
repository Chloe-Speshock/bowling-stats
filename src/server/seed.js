const pool = require("./db");

const seedData = async () => {
  try {
    await pool.query(/*sql*/ `
        INSERT INTO teams (team_name) VALUES ("The Bowl'd and the Beautiful");
        `);

    await pool.query(/*sql*/ `
        INSERT INTO players (team_id, name, total_games, total_score, high_score, average_score, handicap)
        VALUES
        (1, 'Dash', 12, 1500, 190, 179, 45);
        `);

    console.log("data seeded successfully!");
  } catch (error) {
    console.error("error seeding data:", error);
  } finally {
    pool.end();
  }
};

seedData();
