const express = require("express");
const app = express();

const mysql = require("mysql");
const myConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "login_system",
});
myConnection.connect((err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log("database connection succesful");
  }
});
myConnection.query(
  "CREATE TABLE IF NOT EXISTS users(userid INT NOT NULL AUTO_INCREMENT, email VARCHAR(100), fullname VARCHAR(100), password VARCHAR(255), phone VARCHAR(20), PRIMARY KEY(userid));",
  (sqlerror) => {
    if (sqlerror) {
      console.log(sqlerror.message);
    } else {
      console.log("table created");
      // console.log(QRES);
    }
  }
);

app.get("/", (req, res) => {
  console.log(req.baseUrl);
  res.render("index.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});
//Receive data
//compare with the db
//if pass, create a session
//what are sessions
//what does it mean tosay nttps is stateless
//uuids,params

app.get("/signup", (req, res) => {
  console.log(req.baseUrl);
  res.render("signup.ejs");
});
//Receive data
//input validation
//hash the password

app.get("/protected route one", (req, res) => {
  res.send("Only for signed in users!");
});
app.get("/ProtectedRoutetwo", (req, res) => {
  res.send("Only for logged in in users!");
});
app.get("/PublocRouteone", (req, res) => {
  res.send("for any visitors!");
});
app.get("*", (req, res) => {
  res.status(404).send("page not found");
});

app.listen(5000, () => console.log("server running on port 5000"));
