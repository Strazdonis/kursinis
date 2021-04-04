const mongoose = require('mongoose');
const User = require("../../models/user");

module.exports = (app) => {
    app.post('/login', (req, res) => {
        const data = req.body;
        console.log(data);
        var authenticate = User.authenticate();
        if (typeof data.username !== "string" || typeof data.password !== "string") {
            return res.status(400).json({ error: { message: "bad request" } });
        }
        authenticate(data.username, data.password, function (err, result) {
            if (err) {
                //TODO: return more reasonable messages & status codes, document them
                return res.status(500).json({ error: err });
            }
            if (!result) {
                return res.status(401).json({ error: { message: "wrong username or password" } });
            }
            req.logIn(result, function (err) {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: err });
                }
                const payload = {
                    perms: result.perms,
                    verified: result.verified,
                    username: result.username,
                    fullname: result.fullname,
                    city: result.city,
                };


                return res.json({
                    success: true,
                    message: 'Successful Login',
                    // user: payload
                });
            });
        });
    });
};

