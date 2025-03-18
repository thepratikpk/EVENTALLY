import express from "express";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import pg from "pg";
import bodyParser from "body-parser";

const app = express();
const PORT = 3000;



dotenv.config();


const __dirname = dirname(fileURLToPath(import.meta.url));
/*
  app.get("/login", (req, res) => {
    res.render("login.ejs");
  });
  
  app.get("/register", (req, res) => {
    res.render("register.ejs");
  });*/


// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "frontend", "public")));


app.use(bodyParser.urlencoded({ extended: true }));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "public", "index.html"));
});

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "userInfo",
  password: "record@3561",
  port: 5126,
});
db.connect();



app.post("/register", async (req, res) => {
    const { username, password } = req.body;  

    try {
        // Check if the username already exists
        const checkResult = await db.query("SELECT * FROM userInfo WHERE username = $1", [username]);

        if (checkResult.rows.length > 0) {
            res.send("Username already Exists. Try logging in or register with other username.");
        } else {
            // Insert new user
            await db.query(
                "INSERT INTO userInfo (username, password) VALUES ($1, $2)",
                [username, password]
            );
            res.send("Registered Successfully")
            //res.render("secrets.ejs");
        }
    } catch (err) {
        console.log(err);
        res.send("An error occurred during registration.");
    }
});


app.post("/login", async (req, res) => {
    const { username, password } = req.body;  // Extract username and password

    try {
        // Find user by username
        const result = await db.query("SELECT * FROM userInfo WHERE username = $1", [username]);

        if (result.rows.length > 0) {
            const user = result.rows[0];

            if (password === user.password) {
                res.send("Login Successful")
                //res.render("secrets.ejs");
            } else {
                res.send("Incorrect Password");
            }
        } else {
            res.send("User not found");
        }
    } catch (err) {
        console.log(err);
        res.send("An error occurred during login.");
    }
});


app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
});


