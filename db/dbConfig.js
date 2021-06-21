require("dotenv").config();

const { Pool } = require("pg");

const isProduction = process.env.NODE_ENV === "production"; // boolean sprawdza czy appka jest w produkcji, jesli nie to zwraca false

const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;
                        // enviroment variable ? 

const pool = new Pool({
  connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
                  // condition   value of condition t/thy   value of condition f/fsy
});
    // objetc & ternary operator
    // if statements return no values
    

module.exports = { pool };


