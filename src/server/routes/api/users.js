const User = require('../../models/user');
const logger = require("../../logger");
const { auth } = require('../../utils/middlewares');
module.exports = (app) => {
    app.get('/users/', auth.moderator, (req, res) => {
        User.find({ }, (err, doc) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            return res.json({ message: "success", result: doc });
        });

    });
};