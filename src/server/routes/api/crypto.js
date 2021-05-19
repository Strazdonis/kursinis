const Crypto = require('../../models/crypto');
const { getManyCryptoData } = require('../../utils/crypto');
const logger = require("../../logger");
const { auth } = require('../../utils/middlewares');
module.exports = function (router) {
    router.post('/crypto', (req, res) => {
        const body = req.body;
        let track = body.crypto;
        if (Array.isArray(track)) {
            track = track.map(c => c.toLowerCase());
        } else {
            logger.verbose(`unexpected track type in crypto.js: ${typeof track}`);
            return res.status(400).json({ error: "bad request, body.crypto must be an array" });
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

    router.delete('/crypto', (req, res) => {
        const body = req.body;
        let crypto = body.crypto;
        const user = req.user._id;
        Crypto.findOne({ user: user }, (err, doc) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            if (!doc) {
                return res.status(404).json({ error: "not found" });
            }
            let tracked = doc.crypto;
            if (tracked.length == 0) {
                return res.status(404).json({ error: "You track no cryptos already" });
            }
            tracked = tracked.filter(t => t !== crypto);
            doc.crypto = tracked;
            doc.save(function (err) {
                if (err) {
                    logger.error(`/api/crypto/ couldn't save cryptos ${doc} in DB.\nERROR: ${err.stack}`);
                    return res.status(400).send({ error: err, message: "failed saving updated data in database" });
                }

                res.status(202).json({ success: true, message: 'success!', result: tracked });
            });
        });
    });

    router.put('/crypto', (req, res) => {
        const body = req.body;
        let track = body.crypto;
        if (!Array.isArray(track)) {
            logger.verbose(`unexpected track type in crypto.js: ${typeof track}`);
            return res.status(400).json({ error: "bad request, body.crypto must be an array" });
        }
        const user = req.user._id;
        Crypto.findOne({ user: user }, (err, doc) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
           
            if(!doc) {
                doc = new Crypto();
                doc.user = user;
            }
            console.log(doc);
            //jshint ignore:start
            let tracked = doc.crypto || [];
            //jshint ignore:end
            if (tracked.length >= 8) {
                return res.status(404).json({ error: "You already track the maximum amount of cryptocurrencies." });
            }
            track.forEach(t => {
                t = t.toLowerCase();
                if (!tracked.includes(t)) {
                    tracked.push(t);
                }
            });
            if (tracked.length >= 8) {
                tracked = tracked.slice(0, 8);
            }
            doc.crypto = tracked;
            doc.save(function (err) {
                if (err) {
                    logger.error(`/api/crypto/ couldn't save cryptos ${doc} in DB.\nERROR: ${err.stack}`);
                    return res.status(400).send({ error: err, message: "failed saving updated data in database" });
                }

                res.status(202).json({ success: true, message: 'success!', result: tracked });
            });
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
            if (!doc) {
                return res.json({ success: true, result: [] });
            }
            // return res.json({ message: "success", result: doc });
            const list = doc.crypto;
            if(doc.crypto.length == 0) {
                return res.json({data: []});
            }
            const ids = list.join(",");
            const data = await getManyCryptoData(ids);
            if (data.response == '400') {
                return res.json({ error: true, message: "API returned an error. Please try again later." });
            }
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