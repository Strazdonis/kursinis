/* jshint esversion: 9 */
const express = require('express');
require('dotenv').config();
const app = express();
const morgan = require('morgan');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const helmet = require('helmet');
const { generateNonce, getDirectives, loadRoutes } = require('./utils/expressUtils');
const { connectDb } = require('./models/index');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const User = require('./models/user');
// basic security
app.use(helmet());
// logging requests
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
// parse json
app.use(express.json());

// session handling
const sessionStore = new MongoStore({ mongoUrl: process.env.DB_URI, collection: 'sessions' });
// TODO: set expiration date etc.
app.use(session
    ({
        secret: process.env.SESSION_PASSWORD,
        resave: false,
        saveUninitialized: false,
        store: sessionStore,
    })
);

// authorization handling
app.use(passport.initialize());
app.use(passport.session());

// serve static files in / from public/
app.use(express.static('public'));

// helmet csp stuff
const csp = require(`helmet-csp`);


// use hbs engine
const handlebars = require('express-handlebars');
app.set('view engine', 'hbs');
app.engine('hbs', handlebars({
    layoutsDir: __dirname + '/views/layouts',
    extname: 'hbs',
    // defaultLayout: 'default',
}));

// handle content securicy policy to only allow required files to be loaded
app.use(generateNonce);
app.use(csp({
    directives: getDirectives()
}));

// based on https://www.npmjs.com/package/passport-local-mongoose
// https://levelup.gitconnected.com/everything-you-need-to-know-about-the-passport-local-passport-js-strategy-633bbab6195?gi=e202dce394bf
// https://mherman.org/blog/user-authentication-with-passport-dot-js/
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

sessionStore.on('set', data => {
    console.log("saved session", data);
});


const routePath = "./routes/";
// dynamically load routes from /routes
loadRoutes(routePath, app);


connectDb().then(async (connection) => {


    app.listen(3000, _ => { console.log("App is listening on http://localhost:3000"); });
});




