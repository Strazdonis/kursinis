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
        console.log(data);
        if (typeof data.username !== "string" || typeof data.password !== "string") {

            return res.status(400).json({ error: { message: "bad request" } });
        }
        if (data.username.length < 6 || data.password.length < 6) {
            return res.status(400).json({ error: { message: "username and password must be at least 6 characters long" } });
        }
        if (data.password != data.password2) {
            return res.status(400).json({ error: { message: "passwords dont match" } });
        }
        const code = makeid(16);
        User.register({ username: data.username, email: data.email, code: code, fullname: `${data.firstname} ${data.lastname}`, city: data.city }, data.password, function (err, user) {
            if (err) {
                //TODO: return more reasonable messages & status codes, document them
                if(err.driver && err.keyPattern.email) {
                    return res.status(500).json({ error: {message: "This email is already in use"} });
                }
                return res.status(500).json({ error: err });
            }
            console.log(user);
            return res.send(200, { success: true, message: "registered, you can now login" });
        });
    });
};

