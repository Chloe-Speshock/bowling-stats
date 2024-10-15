const express = require("express");
const db = require("./db");
const app = express();

app.use(express.json());

//route to all players
app.get("/api/players", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM players");
    res.json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
