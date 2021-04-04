const morgan = require('morgan');
const uuid = require('uuid');

module.exports = {
    apiRouterMiddleware: (function (req, res, next) {
        // API-only middleware, check if logged in etc.
        const endpoint = req.path.replace(/\//g, "");
        //TODO: get these more dynamically
        const AuthOnly = ["crypto", "logout", "todo", "verify"];
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
    httpLogger: morgan(
        ':method :url :status :res[content-length] - :response-time ms',
    ),
    auth: {
        required: (req, res, next) => {
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
    }
};