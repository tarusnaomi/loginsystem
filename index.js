const express = require("express");
const session = require("express-session");
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
    console.log(err);
  } else {
    console.log("database connection succesful");
  }
});
// myConnection.query("DROP TABLE users");
myConnection.query(
  "CREATE TABLE IF NOT EXISTS users(userid INT NOT NULL AUTO_INCREMENT, email VARCHAR(100), fullname VARCHAR(100), password VARCHAR(255), phone VARCHAR(20), dob DATE, PRIMARY KEY(userid));",
  (sqlerror) => {
    if (sqlerror) {
      console.log(sqlerror.message);
    } else {
      console.log("table created");
      // console.log(QRES);
    }
  }
);
//use method is used to run moddle ware functions,these are functions run in every request
app.use((req, res, next) => {
  console.log("this is a middleware function runs in every request!!");
  next();
});
//middleware can be used i authentication i.e making sure that requests are being received from logged in users since http iis stateless
//Htpps stateless implies that every request--every response cycle is completey independent even if they are from the same device
app.use(express.urlencoded({ extended: false })); //body parser--converts the inocming files into javascript objects
app.use(express.static("assets"));
app.use(
  session({
    secret: "ghgh",
    resave: false,
    saveUninitialized: false,
  })
);
app.get("/", (req, res) => {
  console.log(req.baseUrl);
  // console.log("cookies");
  res.render("index.ejs");
});

app.get("/login", (req, res) => {
  if (req.query.signupSuccess) {
    res.render("login.ejs", {
      message: "Signup successful!! Ypu can now log in",
    });
  } else {
    res.render("login.ejs");
  }
});

app.post("/login", (req, res) => {
  //Receive data
  //compare with the db
  //if pass, create a session
  console.log(req.body);
  const loginStatement = `SELECT email,password FROM users WHERE email = '${req.body.email}'`;
  myConnection.query(loginStatement, (sqlErr, userData) => {
    if (sqlErr) {
      console.log(sqlErr.message);
      res.render(500).render("login.ejs", {
        message: "Server Error, contact admin if problem persists",
      });
    } else {
      if (userData.length == 0) {
        res
          .render(401)
          .render("login.ejs", { message: "Email or Password is invalid " });
      } else {
        if (compareSync(req.body.pass.userdata[0].password)) {
          //create a session
          // res.cookie("email", userData[0].email, { maxAge: 60 });
          req.session.user = userData[0];
          res.redirect("/");
        } else {
          res
            .render(401)
            .render("login.ejs", { message: "Email or Password is invalid " });
        }
      }
    }
  });
});

app.get("/signup", (req, res) => {
  console.log(req.baseUrl);
  res.render("signup.ejs");
});
app.post("/signup", (req, res) => {
  //Receive data
  //input validation-- compare password, email validation,--sql injection
  //hash the password
  //save data in db
  console.log(req.body);
  if (req.body.pass === req.body.confirm_pass) {
    //proceed
    let sqlStatement = `INSERT INTO users(email,fullname,password,phone,dob) VALUES( "${req.body.email}", "${req.body.fullname}", "${req.body.pass}", "${req.body.phone}", "${req.body.dob}")`;
    myConnection.query(sqlStatement, (sqlErr) => {
      if (sqlErr) {
        // res.status(500).send("Database error");
        res.status(500).render("signup.ejs", {
          error: true,
          errMessage: "Server Error: contact admin if this persists",
          prevInput: req.body,
        });
      } else {
        res.status(304).redirect("/login?signupSuccess=true");
      }
    });
  } else {
    res.render("signup.ejs", {
      error: true,
      errMessage: "password and confirm password do not match!",
      prevInput: req.body,
    });
  }
});

app.get("/protected route one", (req, res) => {
  res.send("Only for signed in users!");
});
app.get("/ProtectedRoutetwo", (req, res) => {
  res.send("Only for logged in in users!");
});
app.get("/PublicRouteone", (req, res) => {
  res.send("for any visitors!");
});
app.get("*", (req, res) => {
  res.status(404).send("page not found");
});

app.listen(5000, () => console.log("server running on port 5000"));
// bcrypt.hashSync
