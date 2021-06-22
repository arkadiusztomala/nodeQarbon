const uWS = require("uwebsockets.js");
const express = require("express");   // zastapic nanoexpress 
const app = express();
const PORT = process.env.PORT || 3000;
const db = require("./db/db");
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");


const intializePassport = require("./passportConfig");

intializePassport(passport);

// Middleware

// Parses details from a form

app.use(express.json()); //express. json() is a method inbuilt in express to recognize the incoming Request Object as a JSON Object. This method is called as a middleware in your application using the code: app. use(express

app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

app.use(session({
  // Key we want to keep secret which will encrypt all of our information
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
// app.get("/todo/getTwo/:id", async (req, res) => {
//   const id = parseInt(req.params.id);
//   const result = await db.query(getOne("todo"), [id]);
//   if (result.length === 0) {
//     res.status(404).send("Todo doesnt exist.");
//     return;
//   }
//   res.status(200).json(result);
// });


// /todo/list
app.get("/todo/list", (req, res) => {
  db.query("SELECT * FROM todo WHERE user_id = $1", [req.user.id])
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
  db.query("INSERT INTO todo (description, user_id) VALUES ($1, $2)", [description, req.user.id])
    .then(() => {
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

app.get("/auth/login", (req, res) => {
  res.render("login");
});

app.get("/auth/register", (req, res) => {
  res.render("register");
});

app.get("/todo/dashboard", (req, res) => {
  res.render("dashboard", { user: req.user });
});

app.get("/auth/logout", (req, res) => {
  req.logOut();
  req.flash("success_msg", "You are now logged out of your dashboard")
  res.redirect('/auth/login');
});

app.post("/auth/register", async (req, res) => {
  let { email, password, password2 } = req.body;

  console.log({
    email,
    password,
    password2
  });
 
  let errors = validate(email, password, password2);

  if (errors.length > 0) {
    res.render("register", { errors });
  } else {
    let hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    //sprawdzanie czy uzytkowanik istnieje
    db.query(`SELECT * FROM users WHERE email = $1`, [email])
      .then((data) => {
        console.log(data);

        if (data.length > 0) {
          errors.push({ message: "Email already registered" });
          res.render("register", { errors })
        } else {
          db.query(`INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, password`, [email, hashedPassword])
          .then(() => {
              res.status(201).send("You've been registered.");
            }
          )
          .catch((error) => {
            throw error;
          })
        }
      })
      .catch((error) => {
        throw error;
      });
  }

});

app.post("/auth/login", passport.authenticate('local', {
  successRedirect: "/todo/dashboard",
  failureRedirect: "/auth/login",
  failureFlash: true
})
);

function validate(email, password, password2) {
  let errors = [];
  if (!email || !password || !password2) {
    errors.push({message: "Please enter all fields"});
  }

  if (password.length < 6) {
    errors.push({message: "Password should be more than 6 characters long"});
  }

  if (password !== password2) {
    errors.push({message: "Passwords dosnt match"});
  }

  return errors;
}

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});