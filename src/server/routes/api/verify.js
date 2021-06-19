const User = require('../../models/user');
const { auth } = require('../../utils/middlewares');
module.exports = function (router) {
    router.post('/verify', auth.required, (req, res) => {
        const body = req.body;
        let submitted = body.code;
        if (typeof submitted != "string") {
            return res.status(400).json({ error: "bad request" });
        }
        if (req.user.verified) {
            return res.status(200).json({ message: "already verified" });
        }
        const user = req.user._id;
        const required = req.user.code;
        if (submitted === required) {
            User.updateOne({ _id: user }, { verified: true }, (err, doc) => {
                if (err) {
                    return res.status(500).json({ error: err });
                }

                return res.json({ message: "success" });
            });
        } else {
            return res.status(400).json({ error: "bad request" });
        }
    });

    router.get('/verify', auth.required, (req, res) => {
        return res.status(200).json({ status: req.user.verified });
    });
};