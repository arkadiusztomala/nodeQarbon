const Pool = require("pg").Pool;

const pool = new Pool({
    user: "todoapp",
    password: "1qaz",
    host: "localhost",
    port: 5432,
    database: "postgres"
});

module.exports = pool;