const User = require("../../models/user");
const logger = require("../../logger");
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

            return res.status(400).json({ error: { message: "bad request" } });
        }
        if (data.password.length < 6) {
            return res.status(400).json({ error: { message: "password must be at least 6 characters long" } });
        }
        if (data.password != data.password2) {
            return res.status(400).json({ error: { message: "passwords dont match" } });
        }
        const code = makeid(16);
        // TODO: remove username, login using email instead
        User.register({ username: data.email, displayname: `${data.firstname} ${data.lastname}`, email: data.email, code: code, firstname: data.firstname, lastname: data.lastname }, data.password, function (err, user) {
            if (err) {
                //TODO: return more reasonable messages & status codes, document them
                if(err.driver && err.keyPattern.email) {
                    return res.status(500).json({ error: {message: "This email is already in use"} });
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

