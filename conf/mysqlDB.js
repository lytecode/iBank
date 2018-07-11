require('dotenv').config()
const knex = require("knex")

const db = knex({
    client: process.env.DB_CLIENT,
    connection: {
        host: process.env.DB_URL,
        user: process.env.DB_USER,
        database: process.env.DB_DATABASE
    }
});

module.exports = db;