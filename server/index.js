/* jshint esversion: 9 */
const express = require('express');
const app = express();
const morgan = require('morgan');
const fs = require("fs");
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const helmet = require('helmet');

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
const uuid = require(`uuid`);

// use hbs engine
const handlebars = require('express-handlebars');
app.set('view engine', 'hbs');
app.engine('hbs', handlebars({
    layoutsDir: __dirname + '/views/layouts',
    extname: 'hbs',
    // defaultLayout: 'default',
}));

function generateNonce(req, res, next) {
    const rhyphen = /-/g;
    res.locals.nonce = uuid.v4().replace(rhyphen, ``);
    next();
}

function getNonce(req, res) {
    return `'nonce-${res.locals.nonce}'`;
}

function getDirectives () {
    const self = `'self'`;
    const unsafeInline = `'unsafe-inline'`;
    const scripts = [
    ];
    const styles = [
        'https://ka-f.fontawesome.com/',
        'https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css',
        'https://fonts.googleapis.com',
        
    ];
    const fonts = [
        `https://fonts.gstatic.com/`,
    ];
    const frames = [

    ];
    const images = [

    ];
    const connect = [

    ];
  
    return {
      defaultSrc: [self],
      scriptSrc: [self, getNonce, ...scripts],
      styleSrc: [self, unsafeInline, ...styles],
      fontSrc: [self, ...fonts],
      frameSrc: [self, ...frames],
      connectSrc: [self, ...connect],
      imgSrc: [self, ...images],
      objectSrc: [self],
  
      // breaks pdf in chrome:
      // https://bugs.chromium.org/p/chromium/issues/detail?id=413851
      // sandbox: [`allow-forms`, `allow-scripts`, `allow-same-origin`],
    };
  }


app.use(generateNonce);
app.use(csp({
    directives: getDirectives()
}));


const routePath = "./routes/";
// dynamically load routes from /routes
fs.readdirSync(routePath).forEach(function (file) {
    const route = routePath + file;
    require(route)(app);
    console.log("[Route] /" + file);
});

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




app.listen(3000, _ => { console.log("App is listening on http://localhost:3000"); });