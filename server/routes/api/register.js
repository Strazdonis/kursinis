const mongoose = require('mongoose');
const User = require("../../models/user");

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
        if (typeof username !== "string" || typeof data.password !== "string" ) {
            return res.status(400).json({ error: "bad request" });
        }
        if (data.username.length < 6 || data.password.length < 6) {
            return res.status(400).json({ error: "username and password must be at least 6 characters long" });
        }
        const code = makeid(16);
        User.register({ username: data.username, email: data.email, code: code, fullname: `${data.firstname} ${data.lastname}`, city: data.city }, data.password, function (err, user) {
            if (err) {
                //TODO: return more reasonable messages & status codes, document them
                res.status(500).json({ error: err });
            }
            console.log(user);
            res.send(200, { message: "success" });
        });
    });
};

