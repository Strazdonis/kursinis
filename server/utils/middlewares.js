const morgan = require('morgan');

module.exports = {
    apiRouterMiddleware: (function (req, res, next) {
        // API-only middleware, check if logged in etc.
        const endpoint = req.path.replaceAll("/", "");
        console.log(endpoint)
        //TODO: get these more dynamically
        const AuthOnly = ["crypto", "logout", "todo", "verify"];
        if (AuthOnly.includes(endpoint) && !req.isAuthenticated()) {
            return res.status(401).json({ error: "You must be logged in!" });
        }
        next();
    }),
    httpLogger: morgan(
        ':method :url :status :res[content-length] - :response-time ms',
    ),
};