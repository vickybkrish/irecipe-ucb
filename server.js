const express = require('express');
const session  = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const handlebars = require('express-handlebars');
const extend = require('handlebars-extend-block');
const helpers = require('handlebars-helpers')();
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const routes = require('./controllers/recipeController.js');
const jquery = require('jquery');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const flash    = require('connect-flash');
const passport = require('passport');

require('./config/passport')(passport); // pass passport for configuration


const port = process.env.PORT || 3000;

const app = express();


const hbs = handlebars.create({
    partialsDir: [
        'views/partials/'
    ],
    defaultLayout: 'main'
});


app.use(express.static('public'));
app.use(cookieParser()); // read cookies (needed for auth)
// required for passport
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'trythis_db'
};

var sessionStore = new MySQLStore(options);


app.use(session({
    secret: '1hg9280gej32SGSlhfxsbnv482',
    resave: false,
    store: sessionStore,
    saveUninitialized: false
 } )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions




app.use(flash()); // use connect-flash for flash messages stored in session

app.use(morgan('dev')); // log every request to the console


app.use('/', routes);

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');



// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport


// launch ======================================================================
app.listen(port);
console.log('The app is running on port ' + port);
