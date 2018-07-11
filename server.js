const bcrypt = require('bcrypt-nodejs')
const bodyParser = require('body-parser')
const connx = require('./conf/connect')
const db = require('./conf/mysqlDB')
const ejs = require('ejs')
const express = require('express')
const passport = require("passport")
const routes = require('./auth/routes')
const session = require('express-session')
require('dotenv').config()
require('./auth/passport')

const app = express();
const port = process.env.PORT || 3000;


app.use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: false }))
    .use(passport.initialize())
    .use(passport.session())

    .set('view engine', 'ejs')
    .use(express.static('.'))
    .use(routes)

app.listen(port, () => console.log(`App started on port ${port}`));