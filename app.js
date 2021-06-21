const uWS = require("uwebsockets.js");
//const pgPromise = require('pg-promise')
const express = require("express");   // zastapic nanoexpress 
const app = express();
const PORT = process.env.PORT || 3000;
// const db = require("./db/db"); zastapione przez const { pool }
const { pool } = require("./db/dbConfig")
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");


const intializePassport = require("./passportConfig");

intializePassport(passport);

//Middleware

app.use(express.json()); //express. json() is a method inbuilt in express to recognize the incoming Request Object as a JSON Object. This method is called as a middleware in your application using the code: app. use(express

app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

app.use(session({
  secret: 'secret',

  resave: false,

  saveUninitialized: false,

  maxAge: Date.now() + (7 * 86400 * 1000)
})
);

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

// endpoints

// auth/register/

// /auth/login
const getOne = (table) => `SELECT * FROM ${table} WHERE id = $1`;
// /todo/get
app.get("/todo/get/:id", (req, res) => {
  const id = parseInt(req.params.id);
  db.query(getOne("todo"), [id])
    .then((data) => {
      if (data.length === 0) {
        res.status(404).send("Todo doesnt exist.");
        return;
      }
      res.status(200).json(data);
    })
    .catch((error) => {
      throw error;
    });
});

// /todo/get
app.get("/todo/getTwo/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const result = await db.query(getOne("todo"), [id]);
  if (result.length === 0) {
    res.status(404).send("Todo doesnt exist.");
    return;
  }
  res.status(200).json(result);
});
// /todo/list
app.get("/todo/list", (req, res) => {
  db.query("SELECT * FROM todo")
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      throw error;
    });
});

// /todo/add
app.post("/todo/add", (req, res) => {
  const { description } = req.body;
  db.query("INSERT INTO todo (description) VALUES ($1)", [description])
    .then((data) => {
      res.status(201).send("Todo has been added.");
    })
    .catch((error) => {
      throw error;
    });
});

// /todo/delete
app.delete("/todo/delete/:id", (req, res) => {
  const id = parseInt(req.params.id);
  db.query("DELETE FROM todo WHERE id = $1", [id])
    .then((data) => {
      res.status(200).send("Todo has been deleted.");
    })
    .catch((error) => {
      throw error;
    });
});

// /todo/update
app.post("/todo/update/:id", (req, res) => {
  const { description } = req.body;
  const id = parseInt(req.params.id);
  db.query("UPDATE todo SET description = $1 WHERE id = $2", [description, id])
    .then((data) => {
      res.status(200).send("Todo has been updated.");
    })
    .catch((error) => {
      throw error;
    });
});

// /todo/status
app.post("/todo/status/:id", (req, res) => {
  const { done } = req.body;
  const id = parseInt(req.params.id);
  db.query("UPDATE todo SET done = $1 WHERE id = $2", [done, id])
    .then((data) => {
      res.status(200).send("Todo status has been changed.");
    })
    .catch((error) => {
      throw error;
    });
});

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/users/login", (req, res) => {
  res.render("login");
});

app.get("/users/register", (req, res) => {
  res.render("register");
});

app.get("/users/dashboard", (req, res) => {
  res.render("dashboard", { user: req.user.name });
});

app.get("/users/logout", (req, res) => {
  req.logOut();
  req.flash("success_msg", "You are now logged out of your dashboard")
  res.redirect('/users/login');
});

app.post("/users/register", async (req, res) => {
  let { name, email, password, password2 } = req.body;

  console.log({
    name,
    email,
    password,
    password2
  });
 
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({message: "Please enter all fields"});
  }

  if (password.length < 6) {
    errors.push({message: "Password should be more than 6 characters long"});
  }

  if (password !== password2) {
    errors.push({message: "Passwords dosnt match"});
  }

  if (errors.length > 0) {
    res.render("register", { errors });
  } else {
    let hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    //sprawdzanie czy uzytkowanik istnieje
    pool.query(
      `SELECT * FROM users
      WHERE email = $1`, [email], (err, results) => {
        if (err){                   //callback fnct
          throw err
        }
        console.log(results.rows);

        if (results.rows.length > 0) {
          errors.push({ message: "Email already registered" });
          res.render("register", { errors })
        } else {
          pool.query(
            `INSERT INTO users (name, email, password)
            VALUES ($1, $2, $3)
            RETURNING id, password`, [name, email, hashedPassword], (err, result) => {
              if (err){
                throw err;
              }
              console.log(result.rows)
              req.flash("success_msg", "Yey you are now registered!");
              res.redirect("/users/login");
            }
          )
        }
      }
    )
  }

});

app.post("/users/login", passport.authenticate('local', {
  successRedirect: "/users/dashboard",
  failureRedirect: "/users/login",
  failureFlash: true
})
);


app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});



// POST wyslac

//!!!!!!!!!!!!!!!!!!!!
// To start the service, type: sudo service postgresql start
// To conntect to postgres, type: sudo -u postgres psql
