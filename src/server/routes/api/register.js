const User = require("../../models/user");
const logger = require("../../logger");
const xssFilters = require('xss-filters');
function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

module.exports = (app) => {
    app.post('/register', (req, res) => {
        const data = req.body;
        logger.verbose(data);
        if (typeof data.email !== "string" || typeof data.password !== "string") {

            return res.status(400).json({ error: { message: "badReq" } });
        }
        if (data.password.length < 6) {
            return res.status(400).json({ error: { message: "passShort" } });
        }
        if (data.password != data.password2) {
            return res.status(400).json({ error: { message: "passMismatch" } });
        }
        const code = makeid(16);
        // TODO: remove username, login using email instead
        User.register({ username: xssFilters.inHTMLData(data.email), displayname: `${xssFilters.inHTMLData(data.firstname)} ${xssFilters.inHTMLData(data.lastname)}`, email: xssFilters.inHTMLData(data.email), code: code, firstname: xssFilters.inHTMLData(data.firstname), lastname: xssFilters.inHTMLData(data.lastname) }, data.password, function (err, user) {
            if (err) {
                //TODO: return more reasonable messages & status codes, document them
                if (err.driver && err.keyPattern.email) {
                    return res.status(500).json({ error: { message: "emailTaken" } });
                } else {
                    logger.warn(`Couldn't find an appropriate error handler for ${err.keyPattern}, ${err}`);
                }
                return res.status(500).json({ error: err });
            }
            logger.verbose(user);
            return res.status(200).json({ success: true, message: "registered, you can now login" });
        });
    });
};

