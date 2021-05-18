const User = require('../../models/user');
const logger = require("../../logger");
const { auth } = require('../../utils/middlewares');
module.exports = (app) => {
    /**
     * fetch a user by ID
     * ID must be passed by URL - /api/user/606105d8e86aa41d20f327cb
     * @returns { id, fullname }
     */
    app.get('/user/:id', auth.moderator, (req, res) => {
        User.findById(req.params.id, function (err, user) {
            if (err) {
                logger.error(`GET /api/user/ finding user ${uid} threw an error ${err.stack}`);
                return res.status(404).json({ error: err, message: 'failed finding your user in the database' });
            }

            if (!user) {
                logger.error(`/api/user/ couldn't find user ${uid} in DB ${err.stack}`);
                return res.status(404).json({ error: err, message: 'failed finding your user in the database' });
            }
            res.status(202).json({ success: true, result: user });
        });
    });

    app.delete('/user/', (req, res) => {
        const body = req.body;
        const uid = body.id;
        User.deleteOne({ _id: uid }, (err, doc) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            return res.json({ message: "success", result: doc });
        });
    });



    app.put('/user/', auth.admin, (req, res) => {
        const body = req.body;
        const uid = body.id;
        User.findById(uid, function (err, user) {
            if (err) {
                logger.error(`PUT /api/user/ finding user ${uid} threw an error ${err.stack}`);
                return res.status(404).json({ error: err, message: 'failed finding your user in the database' });
            }

            if (!user) {
                logger.error(`/api/user/ couldn't find user ${uid} in DB ${err.stack}`);
                return res.status(404).json({ error: err, message: 'failed finding your user in the database' });
            }

            
            user.email = body.email;
            user.username = body.username;
            user.displayname = body.displayname;
            user.firstname = body.firstname;
            user.lastname = body.lastname;
            user.city = body.city;
            user.code = body.code;
            user.perms = body.perms;
            user.verified = body.verified;

            user.save(user, function (err) {
                if (err) {
                    logger.error(`/api/user/ couldn't update (save) user ${uid} in DB.\nUSER: ${user}\nERROR: ${err.stack}`);
                    return res.status(400).send({ error: err, message: "failed saving updated data in database" });
                }

                res.status(202).json({ success: true, user, message: 'User updated!' });
            });
        });
    });

    /**
     * patch (update only given fields) logged in user
     * possible fields - { username, fullname, city }
     * @returns object with a message property
     */
    app.patch('/user/', auth.admin, (req, res) => {
        const uid = req.user._id;
        User.findById(uid, function (err, user) {
            if (err) {
                logger.error(`PATCH /api/user/ finding user ${uid} threw an error ${err.stack}`);
                return res.status(404).json({ error: err, message: 'failed finding your user in the database' });
            }

            if (!user) {
                logger.error(`/api/user/ couldn't find user ${uid} in DB ${err.stack}`);
                return res.status(404).json({ error: err, message: 'failed finding your user in the database' });
            }

            user.displayname = req.body.displayname || user.displayname;
            user.save(function (err) {
                if (err) {
                    logger.error(`/api/user/ couldn't save user ${uid} in DB.\nUSER: ${user}\nERROR: ${err.stack}`);
                    return res.status(400).send({ error: err, message: "failed saving updated data in database" });
                }

                res.status(202).json({ message: 'User updated!' });
            });

        });
    });
};