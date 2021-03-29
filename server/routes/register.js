const mongoose = require('mongoose');
const User = require("../models/user");

module.exports = function (app) {
    app.post('/register', (req, res) => {
        const data = req.body;
        console.log(data);
        User.register({ username: data.username, fullname: `${data.firstname} ${data.lastname}`, city: data.city }, data.password, function (err, user) {
            if (err) {
                //TODO: return more reasonable messages & status codes, document them
                res.status(500).json(err);
            }
            console.log(user);
            res.status(200).json({message: "success"});
        });
    });
};

