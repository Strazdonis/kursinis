const Crypto = require('../../models/crypto');
const { getManyCryptoData } = require('../../utils/crypto');
const logger = require("../../logger");
const { auth } = require('../../utils/middlewares');
module.exports = function (router) {
    router.post('/crypto', (req, res) => {
        const body = req.body;
        let track = body.crypto;
        //TODO: validate if crypto is even available
        //TODO: reject non-arrays?
        if (Array.isArray(track)) {
            track = track.map(c => c.toLowerCase());
        } else if (typeof track == "string") {
            track = track.toLowerCase();
        } else {
            logger.verbose(`unexpected track type in crypto.js: ${typeof track}`);
            return res.status(400).json({ error: "bad request" });
        }

        // TODO: use a more mongoose approach by saving model?
        const user = req.user._id;

        Crypto.findOneAndUpdate({ user: user }, { crypto: track }, { upsert: true, new: true }, (err, doc) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            return res.json({ message: "success", result: doc });
        });
    });

    router.post('/crypto/update_user', (req, res) => {
        const body = req.body;
        let track = body.cryptos;
        //TODO: validate if crypto is even available
        //TODO: reject non-arrays?
        if (Array.isArray(track)) {
            track = track.map(c => c.toLowerCase());
        } else if (typeof track == "string") {
            track = track.toLowerCase();
        } else {
            logger.verbose(`unexpected track type in crypto.js: ${typeof track}`);
            return res.status(400).json({ error: "bad request" });
        }

        // TODO: use a more mongoose approach by saving model?
        const user = req.body.user;

        Crypto.findOneAndUpdate({ user: user }, { crypto: track }, { upsert: true, new: true }, (err, doc) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            return res.json({ success: true, message: "success", result: doc });
        });
    });

    router.get('/crypto', (req, res) => {
        const user = req.user._id;

        Crypto.findOne({ user: user }, async (err, doc) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            // return res.json({ message: "success", result: doc });
            const list = doc.crypto;
            const ids = list.join(",");
            const data = await getManyCryptoData(ids);
            return res.json(data);
        });
    });

    router.get('/crypto/all', auth.moderator, (req, res) => {
        Crypto.find({}, async (err, doc) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            return res.json({ message: "success", result: doc });
        });
    });
};