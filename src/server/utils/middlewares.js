const morgan = require('morgan');
const uuid = require('uuid');
const logger = require("../logger/");
module.exports = {
    // API-only middleware, check if logged in etc.
    // DEPRECATED: use auth.required instead
    apiRouterMiddleware: (function (req, res, next) {
        const endpoint = req.path.replace(/\//g, "");
        const AuthOnly = ["crypto", "logout", "todo", "verify", "calendar"];
        if (AuthOnly.includes(endpoint) && !req.isAuthenticated()) {
            return res.status(401).json({ error: "You must be logged in!" });
        }
        next();
    }),
    generateNonce: function (req, res, next) {

        const rhyphen = /-/g;
        res.locals.nonce = uuid.v4().replace(rhyphen, ``);
        next();
    },

    httpLogger: morgan(":method :url :status :res[content-length] - :response-time ms", { stream: { write: message => logger.verbose(message.trim()) } }),
    auth: {
        required: (req, res, next) => {
            console.log(req.isAuthenticated());
            if (req.isAuthenticated()) {
                return next();
            }
            else {
                res.redirect('/login');
            }
        },
        optional: (req, res, next) => {
            return next();
        },
        moderator: (req, res, next) => {
            if (!req.isAuthenticated()) {
                return res.redirect('/login');
            }
            if (req.user.perms == "moderator" || req.user.perms == "admin") {
                return next();
            }
            logger.verbose(`${req.user} tried accessing moderator only page`);
            return res.redirect('/');

        },
        admin: (req, res, next) => {
            if (!req.isAuthenticated()) {
                return res.redirect('/login');
            }
            if (req.user.perms == "admin") {
                return next();
            }
            logger.verbose(`${req.user} tried accessing admin only page`);
            return res.redirect('/');
        }
    }
};