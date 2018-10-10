'use strict'

const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const RegNumbers = require('./reg');
const flash = require('express-flash');
const session = require('express-session');

const pg = require('pg');
const Pool = pg.Pool;

// should use a SSL connection
let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}
// which db connection to use
const connectionString = process.env.DATABASE_URL || 'postgres://coder:pg123@localhost:5432/reg_numbers';

const pool = new Pool({
    connectionString,
    ssl: useSSL
});

// creating instance of factory function
let regInstance = RegNumbers(pool);

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use(flash());

app.use(session({
    secret: "<add a secret string here>",
    resave: false,
    saveUninitialized: true
}));

app.get('/', async function (req, res, next) {
    try {
        let registrationList = await regInstance.getRegPlate();
       let allTowns = await regInstance.forTowns();
        res.render('home', {
            registrationList,
           allTowns
        });
    } catch (error) {
        next(error)
    }
});

app.post('/reg_numbers', async function (req, res, next) {
    try {
        await regInstance.takeRegNumber(req.body.numberplate);
        res.redirect('/');
    } catch (error) {
        next(error)
    }
});

app.post('/town', async function (req, res, next) {
    try {
        let town = req.body.townRegNo;
        res.redirect('/town/' +town);
    } catch (error) {
        next(error)
    }
});

app.post('/town', async function (req, res, next) {
    try{
        let everyTown = await regInstance.getRegPlate()
        res.redirect('/')
    } catch(error) {
        next(error)
    }
});

app.get('/town/:whichTown', async function (req, res, next){
    try{
        let {whichTown} = req.params;
        let allTowns = await regInstance.forTowns();
        let registrationList = await regInstance.townFilter(whichTown);
        if(registrationList) {
            await regInstance.forTowns();
            req.flash('info', 'registration successfully added');
        } else if (!registrationList) {
            req.flash('info', 'please enter a valid registration')
        }
        res.render('home', {
            registrationList,
            allTowns
        })
    } catch (error) {
        next(error)
    }
});

app.get('/reseting', async function (req, res) {
    await regInstance.resetDb();
    res.redirect('/');
});

app.post('/', async function (req, res) {
    res.render('home')
});
let PORT = process.env.PORT || 3010;

app.listen(PORT, function () {
    console.log('App successfully starting on port', PORT);
});