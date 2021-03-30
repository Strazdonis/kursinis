const Crypto = require('../models/crypto');
module.exports = function (app) {
    app.get('/crypto', (req, res) => {
        //Serves the body of the page aka "main.handlebars" to the container //aka "index.handlebars"
        res.render('crypto', { layout: 'index' });
    });
    app.post('/track-crypto', (req, res) => {
        const body = req.body;
        let track = body.crypto;
        //TODO: validate if crypto is even available
        //TODO: reject non-arrays?
        if (Array.isArray(track)) {
            track = track.map(c => c.toUpperCase());
        } else if (typeof track == "string") {
            track = track.toUpperCase();
        } else {
            return res.send(400, { err: "unexpected crypto format." });
        }

        // TODO: use a more mongoose approach by saving model?
        const user = req.user._id;


        //TODO: investigate deprecation warning
        //!"... when using the findAndModify helpers, 
        //!the following are not applied: defaults, setters, validators, middleware"
        //https://mongoosejs.com/docs/api.html#model_Model.findOneAndUpdate
        Crypto.findOneAndUpdate({ user }, { crypto: track }, { upsert: true, new: true }, (err, doc) => {
            if (err) return res.send(500, { error: err });
            return res.json({ message: "success", result: doc });
        });
    });
    app.get('/track-crypto', (req, res) => {
        const body = req.body;
        const user = req.user._id;
        Crypto.findOne({ user }, (err, doc) => {
            if (err) return res.send(500, { error: err });
            return res.json({ message: "success", result: doc });
        });
    });
};