const localStrategy = require('passport-local').Strategy;
const db = require("./db/db");
const bcrypt = require('bcrypt');

function initialize(passport) {
    const authenticateUser = (email, password, done) => {
        db.query(`SELECT * FROM users WHERE email = $1`, [email])
        .then((data) => {
                console.log(data);

                if (data.length > 0){
                    const user = data[0];

                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if(err){
                            throw err
                        }
                        if(isMatch){
                            return done(null, user);
                        } else {
                            return done(null, false, {message: "Incorrect password"});
                        }
                    });
                } else {
                    return done(null, false, {message: "Email is not registered"})
                }
            }
        )
        .catch((error) => {
            throw error;
        })
    }

    passport.use(
        new localStrategy(
            {
                usernameField: "email",
                passwordField: "password"
            },
            authenticateUser
        )
    );

    passport.serializeUser((user, done) => done(null, user.id));
    // Stores user details inside session. serializeUser determines which data of the user
    // object should be stored in the session. The result of the serializeUser method is attached
    // to the session as req.session.passport.user = {}. Here for instance, it would be (as we provide
    //   the user id as the key) req.session.passport.user = {id: 'xyz'}

    passport.deserializeUser((id, done) => {
        db.query(`SELECT * FROM users WHERE id = $1`, [id])
        .then((data) => {
                return done(null, data[0]);
            }
        )
        .catch((error) => {
            throw error;
        })
    });
    // In deserializeUser that key is matched with the in memory array / database or any data resource.
    // The fetched object is attached to the request object as req.user
}

module.exports = initialize;