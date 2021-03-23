/* jshint esversion: 9 */
const express = require('express');
const app = express();
const morgan = require('morgan');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const helmet = require('helmet');
const { generateNonce, getDirectives, loadRoutes } = require('./utils/expressUtils');
const { models, connectDb } = require('./models/index');

// basic security
app.use(helmet());
// logging requests
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
// parse json
app.use(express.json());
// session handling
app.use(require('express-session')({ secret: 'TODO: use .env to pass a secret here :)', resave: false, saveUninitialized: false }));
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

app.use(generateNonce);
app.use(csp({
    directives: getDirectives()
}));

const routePath = "./routes/";
// dynamically load routes from /routes
loadRoutes(routePath, app);

// TODO: Connect with DB (db must be database, db.users.findByUsername must search for users in DB and return data based on that.)
// Readmore: https://github.com/passport/express-4.x-local-example/blob/master/server.js
passport.use(new Strategy(
    function (username, password, cb) {
        db.users.findByUsername(username, function (err, user) {
            if (err) { return cb(err); }
            if (!user) { return cb(null, false); }
            if (user.password != password) { return cb(null, false); }
            return cb(null, user);
        });
    }));


// serialize & deserialise user so it can be passed around with session
passport.serializeUser(function (user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
    db.users.findById(id, function (err, user) {
        if (err) { return cb(err); }
        cb(null, user);
    });
});

connectDb().then(async () => {
    app.listen(3000, _ => { console.log("App is listening on http://localhost:3000"); });
});




