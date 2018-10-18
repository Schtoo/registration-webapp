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
    // helpers: {
    //     selectedTag: function() {
    //       if (this.selected) {
    //         return 'selected'
    //       }
    //     }
    //   }
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
        let msg = await regInstance.takeRegNumber(req.body.numberplate);
        req.flash('errors', msg);
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
        let response = await regInstance.townFilter(whichTown);
        let registrationList = response.results; 

        let townList = [];

        for(let i=0;i<allTowns.length;i++){
            let townIndex = allTowns[i];
            let town =  {
                starts_with:townIndex.starts_with,
                town_name:townIndex.town_name,
                selected: false
            }
            townList.push(town);
            if(townIndex.starts_with == whichTown ){
                town.selected = 'selected'
            }
        }
         allTowns = townList  
        // console.log(allTowns)

        if (response.status === 'error') {
            req.flash('errors', response.message);
        }
        res.render('home', {
            allTowns,
            registrationList
            
        })
    } catch (error) {
        next(error)
    }
});

app.get('/reseting', async function (req, res) {
    await regInstance.resetDb();
    res.redirect('/');
});

let PORT = process.env.PORT || 3010;

app.listen(PORT, function () {
    console.log('App successfully starting on port', PORT);
});
