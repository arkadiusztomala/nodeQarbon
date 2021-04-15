const pgp = require("pg-promise")({});

const cn = 'postgres://todoapp:1qaz@localhost:5432/postgres'
const db = pgp(cn)

module.exports = db;