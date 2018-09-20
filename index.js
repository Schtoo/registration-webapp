'use strict'

const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const regNumbers = require('./reg.js');
const flash = require('express-flash');
const session = require('express-session');

const pg = require('pg');
const Pool = pg.Pool;

// should we use a SSL connection
let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}
// which db connection to use
const connectionString = process.env.DATABASE_URL || 'postgres://coder:pg123@localhost:5432/greeted_users';

const pool = new Pool({
    connectionString,
    ssl: useSSL
});

// creating instance of factory function
let regInstance = regNumbers(pool);

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use(session({
    secret: "<add a secret string here>",
    resave: false,
    saveUninitialized: true
}));

app.use(flash());

app.get('/', async function(){
    let registrations = {
        reg: await regInstance.takeRegNumber(),
    }
    res.render('home', {
        registrations
    });
});

let PORT = process.env.PORT || 3020;

app.listen(PORT, function(){
    console.log('App successfully starting on port', PORT);
});