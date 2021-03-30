const mongoose = require('mongoose');
const User = require("../models/user");

module.exports = function (app) {
    app.post('/api/register', (req, res) => {
        const data = req.body;
        User.register({ username: data.username, fullname: `${data.firstname} ${data.lastname}`, city: data.city }, data.password, function (err, user) {
            if (err) {
                //TODO: return more reasonable messages & status codes, document them
                res.send(500, { error: err });
            }
            console.log(user);
            res.send(200, { message: "success" });
        });
    });
};

