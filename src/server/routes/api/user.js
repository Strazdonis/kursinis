const User = require('../../models/user');
module.exports = (app) => {
    /**
     * fetch a user by ID
     * ID must be passed by URL - /api/user/606105d8e86aa41d20f327cb
     * @returns { id, fullname }
     */
    app.get('/user/:id', (req, res) => {


    });

    /**
     * patch (update only given fields) logged in user
     * possible fields - { username, fullname, city }
     * @returns null
     */
    app.patch('/user/', (req, res) => {
        const uid = req.user._id;
        User.findById(uid, function (err, user) {
            if (err) {
                console.error(`PATCH /api/user/ finding user ${uid} threw an error`, err);
                return res.status(404).json({ error: err, message: 'failed finding your user in the database' });
            }

            if (!user) {
                console.error(`/api/user/ couldn't find user ${uid} in DB`, err);
                return res.status(404).json({ error: err, message: 'failed finding your user in the database' });
            }

            user.username = req.body.username || user.username;
            user.description = req.body.description || user.description;
            user.manufacturer = req.body.manufacturer || user.manufacturer;
            user.photoUrls = req.body.photoUrls || user.photoUrls;
            user.save(function (err) {
                if (err) {
                    console.error(`/api/user/ couldn't save user ${uid} in DB`, 'USER:', user, 'ERROR:', err);
                    return res.status(400).send({ error: err, message: "failed saving updated data in database" });
                }

                res.status(202).json({ message: 'Phone updated!', user });
            });

        });
    });
};