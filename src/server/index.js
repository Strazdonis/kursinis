const logger = require("./logger");
const express = require('express');
require('dotenv').config();
const app = express();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const helmet = require('helmet');
const { getDirectives, loadRoutes, checkDotEnv, elapsedTime } = require('./utils/expressUtils');
elapsedTime("START importing db");
const { connectDb } = require('./models/index');
elapsedTime("END importing db");
const session = require('express-session');
const mongoSanitize = require('express-mongo-sanitize');
const MongoStore = require('connect-mongo');
const User = require("./models/user");
const router = express.Router();
const apiRouter = express.Router();
const adminRouter = express.Router();
const { apiRouterMiddleware, httpLogger, generateNonce } = require('./utils/middlewares');
const { ExpressPeerServer } = require('peer');
const server = require('http').Server(app);
const io = require('socket.io')(server);
// peerJS call rooms
rooms = [];
// not needed here but this makes pkg package it for mongodb
const saslprep = require("saslprep");

if (!checkDotEnv()) {
    logger.warn("Couldn't find .env file which is used for configuration. Program may work incorrectly.");
}

const crypto = require("crypto");
nonce = crypto.randomBytes(16).toString("hex");

// basic security
app.use(helmet());
// logging requests
app.use(httpLogger);
// parse json
app.use(express.json());

//sanitize input
app.use(mongoSanitize());
// session handling
elapsedTime("START connecting session store");
const sessionStore = new MongoStore({ mongoUrl: process.env.DB_URI || "mongodb://mongo:27017/dashboard", collection: 'sessions' });
elapsedTime("END connecting session store");
// TODO: set expiration date etc.
app.use(session
    ({
        secret: process.env.SESSION_PASSWORD || "changeme",
        resave: false,
        saveUninitialized: false,
        store: sessionStore,
        cookie: {
            //secure: true,
            path: "/",
            sameSite: "strict",
            //httpOnly: true,
            maxAge: 31556952000, // 1 year
        }
    })
);

// authorization handling
app.use(passport.initialize());
app.use(passport.session());

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// serve static files in / from public/
app.use(express.static('public'));

// helmet csp stuff
const csp = require('helmet-csp');



// use hbs engine
const handlebars = require('express-handlebars');
app.set('view engine', 'hbs');
hbs = handlebars.create({
    layoutsDir: __dirname + '/views/layouts',
    extname: 'hbs',
    helpers: require('./utils/handlebars-helpers')
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(function (req, res, next) {
    // if not logged in there's no user
    if (!req.isAuthenticated()) {
        return next();
    }

    try {
        const user = req.user;
        const splitName = user.fullname.split(" ");
        const payload = {
            perms: user.perms,
            verified: user.verified,
            username: user.username,
            fullname: user.fullname,
            firstname: splitName[0],
            displayname: user.displayname,
            lastname: splitName[1],
            city: user.city,
            email: user.email,
            
        };
        res.locals.session = payload;
        res.locals.nonce = nonce;
    } catch (error) {
        logger.error(error.stack);
    }

    next();
});

// parse form data (for login/registration)
app.use(express.urlencoded({
    extended: true,
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

sessionStore.on('set', data => {
    logger.verbose(`saved session: ${data}`);
});




const peerServer = ExpressPeerServer(server, {
    path: '/'
});

app.use('/peerjs', peerServer);


io.on('connection', socket => {
    socket.on('join-room', (roomId, data) => {
        socket.join(roomId);
        socket.broadcast.to(roomId).emit('user-connected', data);
        socket.on('disconnect', () => {
            socket.broadcast.to(roomId).emit('user-disconnected', data);
        });
    });
});



const routePath = "./routes/";

// dynamically load routes from /routes
loadRoutes(routePath, router, 'Route');
const apiRoutePath = "./routes/api/";
apiRouter.use(apiRouterMiddleware);

loadRoutes(apiRoutePath, apiRouter, 'API');

const adminRoutePath = "./routes/admin/";
loadRoutes(adminRoutePath, adminRouter, 'Admin');

app.use('/', router);
app.use('/api', apiRouter);
app.use('/admin', adminRouter);

elapsedTime("START connectig to db");
connectDb().then(async (connection) => {
    elapsedTime("END connecting to DB");
    const port = process.env.PORT || 3000;
    server.listen(port, _ => { logger.info("App is listening on http://localhost:" + port); });
});