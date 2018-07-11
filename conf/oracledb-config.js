require('dotenv').config()
const knex = require('knex')

const conex = knex({
    client: 'oracledb',
    connection: {
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
    }
});

module.exports = conex;