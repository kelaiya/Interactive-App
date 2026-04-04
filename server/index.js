const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

app.use(cors({
  origin: "http://localhost:3000", // frontend origin
  credentials: true
}));

app.get("/", (req, res) => {
  res.send("Backend is running");
});

//CREATE
app.post("/api/users", async(req, res) => {
    const {name, email} = req.body;
    const result = await pool.query("INSERT INTO newusers (name, email) VALUES ($1, $2) RETURNING *",
    [name, email]);
    res.json(result.rows[0]);
});

//READ
app.get("/api/users", async(req, res) => {
    const result = await pool.query("SELECT * FROM newusers");
    res.json(result.rows);
});

//PUT
app.put("/api/users/:id", async(req, res) => {
    const {id} = req.params;
    const {name, email} = req.body;
    const result = await pool.query(`UPDATE newusers SET name = $1, email =$2 WHERE id = $3`,
    [name, email, id]);
    res.json(result.rows[0]);
})

//DELETE
app.delete("/api/users/:id", async(req, res) => {
    const {id} = req.params;
    const result = await pool.query(`DELETE FROM newusers WHERE id = $1 RETURNING *`,
    [id]);
    res.json({ message: "User deleted",
        user: result.rows[0]});
})

const PORT = 5050; // or any free port
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});