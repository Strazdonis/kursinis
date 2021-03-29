const mongoose = require('mongoose');
const User = require("../models/user")

module.exports = function (app) {
    app.post('/login', (req, res) => {
        console.log('is authenticated?: ' + req.isAuthenticated());
        const data = req.body;
        console.log(data);
        var authenticate = User.authenticate();
        authenticate(data.username, data.password, function (err, result) {
            console.log(result);
            if (err) {
                console.error(err);
                //TODO: return more reasonable messages & status codes, document them
                res.status(500).json(err);
            }
            
            req.logIn(result, function (err) {
                if (err) console.error(err);

                console.log('is authenticated?: ' + req.isAuthenticated());

                return res.json({
                    success: true,
                    message: 'Successful Login',
                    user: result
                });
            });

        });
    });
};

