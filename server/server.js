const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const mysql = require("mysql");

const PORT = 8004 || process.env.PORT;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "root",
  database: "Books",
});

// get all users
app.get("/users", (req, res) => {
  db.query("SELECT * FROM booktable", (err, results) => {
    if (err) {
      console.log(err);
    } else {
      res.send(results);
    }
  });
});

//create new user
app.post("/create", (req, res) => {
  const name = req.body.name;
  const age = req.body.age;
  const country = req.body.country;

  db.query(
    "INSERT INTO booktable (name, age, country) VALUES (?,?,?) ",
    [name, age, country],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("values Inserted");
      }
    }
  );
});

app.put("/update/:id", (req, res) => {
  const name = req.body.name;
  const age = req.body.age;
  const country = req.body.country;
  const id = req.params.id;

  db.query(
    `UPDATE booktable SET name = ?, age=?, country=? WHERE id=${id}`,
    [name, age, country],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

// delete a user
app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;

  db.query(`DELETE FROM booktable WHERE id=? `, id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.use("/", (req, res) => {
  res.json("welcome to my api");
});

app.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`);
});
