const mongoose = require('mongoose');
const User = require("../models/user");

module.exports = function (app) {
    app.post('/api/login', (req, res) => {
        const data = req.body;
        console.log(data);
        var authenticate = User.authenticate();
        authenticate(data.username, data.password, function (err, result) {
            if (err) {
                //TODO: return more reasonable messages & status codes, document them
                return res.send(500, {error: err});
            }
            
            req.logIn(result, function (err) {
                if (err) {
                    console.error(err);
                    return res.send(500, {error: err});
                }

                return res.json({
                    success: true,
                    message: 'Successful Login',
                    user: result
                });
            });

        });
    });
};

