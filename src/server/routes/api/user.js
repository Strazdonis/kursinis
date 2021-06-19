const User = require('../../models/user');
const logger = require("../../logger");
const { auth } = require('../../utils/middlewares');
const xssFilters = require('xss-filters');
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

    app.delete('/user/', auth.required, (req, res) => {
        const body = req.body;
        const uid = body.id;
        User.deleteOne({ _id: uid }, (err, doc) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            return res.json({ success: true, message: "success", result: doc });
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


            user.email = xssFilters.inHTMLData(body.email);
            user.username = xssFilters.inHTMLData(body.username);
            user.displayname = xssFilters.inHTMLData(body.displayname);
            user.firstname = xssFilters.inHTMLData(body.firstname);
            user.lastname = xssFilters.inHTMLData(body.lastname);
            user.city = xssFilters.inHTMLData(body.city);
            user.code = xssFilters.inHTMLData(body.code);
            user.perms = xssFilters.inHTMLData(body.perms);
            user.verified = xssFilters.inHTMLData(body.verified);

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
     * patch (update only given fields) for logged in user
     * possible fields - { displayname, firstname, lastname }
     * @returns object with a message property
     */
    app.patch('/user/', auth.required, (req, res) => {
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

            // '??' checks for emptyness, || wouldn't allow falsy values. node v14+ only
            // jshint ignore:start
            user.displayname = xssFilters.inHTMLData(req.body.displayname ?? user.displayname);
            user.firstname = xssFilters.inHTMLData(req.body.firstname ?? user.firstname);
            user.lastname = xssFilters.inHTMLData(req.body.lastname ?? user.lastname);
            user.city = xssFilters.inHTMLData(req.body.city ?? user.city);
            // jshint ignore:end
            user.save(function (err) {
                if (err) {
                    logger.error(`/api/user/ couldn't save user ${uid} in DB.\nUSER: ${user}\nERROR: ${err.stack}`);
                    return res.status(400).send({ error: err, message: "failed saving updated data in database" });
                }

                res.status(202).json({ success: true, message: 'User updated!', result: user });
            });

        });
    });

    app.post("/user/changepass", auth.required, async (req, res) => {
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
            if(req.body.newPassword.length < 6) return res.json({error: true, message: "New password is too short"});
            user.changePassword(req.body.oldPassword, req.body.newPassword).then(async () => {
                const response = await user.save();
                res.json({ success: true, message: "Password changed!" });
            }).catch(err => {
                return res.json({ error: err.name, message: err.message });
            });
        });
    });
};