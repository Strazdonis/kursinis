const mongoose = require('mongoose');
const User = require("../../models/user");

module.exports = (app) => {
    app.post('/register', (req, res) => {
        const data = req.body;
        if(typeof username !== "string" || typeof data.password !== "string") {
            return res.status(400).json({ error: "bad request" });
        }
        if(data.username.length < 5 || data.password.length < 5) {
            return res.status(400).json({ error: "username and password must be at least 6 characters long" });
        }
        User.register({ username: data.username, fullname: `${data.firstname} ${data.lastname}`, city: data.city }, data.password, function (err, user) {
            if (err) {
                //TODO: return more reasonable messages & status codes, document them
                res.status(500).json({ error: err });
            }
            console.log(user);
            res.send(200, { message: "success" });
        });
    });
};

