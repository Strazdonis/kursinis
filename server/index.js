const express = require('express');
require('dotenv').config();
const app = express();
const morgan = require('morgan');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const helmet = require('helmet');
const { generateNonce, getDirectives, loadRoutes } = require('./utils/expressUtils');
const { connectDb, models } = require('./models/index');
const session = require('express-session');
const mongoSanitize = require('express-mongo-sanitize');
const MongoStore = require('connect-mongo');
const User = models.User;
const router = express.Router();
const apiRouter = express.Router();

// basic security
app.use(helmet());
// logging requests
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
// parse json
app.use(express.json());
//sanitize input
app.use(mongoSanitize());
// session handling
const sessionStore = new MongoStore({ mongoUrl: process.env.DB_URI, collection: 'sessions' });
// TODO: set expiration date etc.
app.use(session
    ({
       // name: "talkie.sid", // passport breaks if i set this
        secret: process.env.SESSION_PASSWORD,
        resave: false,
        saveUninitialized: false,
        store: sessionStore,
        cookie: {
            secure: true,
            path: "/",
            sameSite: "strict",
            httpOnly: true,
            maxAge: 31556952000, // 1 year
        }
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
loadRoutes(routePath, router, 'Route');

const apiRoutePath = "./routes/api/";

router.use(function (req, res, next) {
    // API-only middleware, check if logged in etc.
    const split = req.url.split("/");
    const endpoint = split[split.length - 2];
    //TODO: get these more dynamically
    const AuthOnly = ["crypto", "logout", "todo"];
    if(AuthOnly.includes(endpoint) && !req.isAuthenticated()) {
        return res.status(401).json({error: "You must be logged in!"});
    }
    next();
});

loadRoutes(apiRoutePath, apiRouter, 'API');

app.use('/', router);
app.use('/api', apiRouter);

connectDb().then(async (connection) => {
    app.listen(3000, _ => { console.log("App is listening on http://localhost:3000"); });
});




