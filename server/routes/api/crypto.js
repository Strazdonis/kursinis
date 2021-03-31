const Crypto = require('../../models/crypto');
module.exports = function (router) {
    router.post('/crypto', (req, res) => {
        const body = req.body;
        let track = body.crypto;
        //TODO: validate if crypto is even available
        //TODO: reject non-arrays?
        if (Array.isArray(track)) {
            track = track.map(c => c.toUpperCase());
        } else if (typeof track == "string") {
            track = track.toUpperCase();
        } else {
            return res.status(400).json({ error: "bad request" });
        }

        // TODO: use a more mongoose routerroach by saving model?
        const user = req.user._id;

        //TODO: investigate deprecation warning
        //!"... when using the findAndModify helpers, 
        //!the following are not routerlied: defaults, setters, validators, middleware"
        //https://mongoosejs.com/docs/api.html#model_Model.findOneAndUpdate
        Crypto.findOneAndUpdate({ user: user }, { crypto: track }, { upsert: true, new: true }, (err, doc) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            return res.json({ message: "success", result: doc });
        });
    });
    router.get('/crypto', (req, res) => {
        console.log(req.isAuthenticated());
        const user = req.user._id;
        
        console.log(user);
        console.table(user);

        Crypto.findOne({ user: user }, (err, doc) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            return res.json({ message: "success", result: doc });
        });
    });
};