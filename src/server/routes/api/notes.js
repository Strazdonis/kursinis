const Notes = require('../../models/notes');
const { auth } = require('../../utils/middlewares');
module.exports = (app) => {
    app.get('/notes', (req, res) => {
        const user = req.user._id;
        Notes.find({ user: user }, (err, doc) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            return res.json({ message: "success", result: doc });
        });
    });

    app.get('/notes/all', auth.moderator, (req, res) => {
        Notes.find({}, (err, doc) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            return res.json({ message: "success", result: doc });
        });
    });

    //update it's text
    app.put('/notes/:user_id', auth.moderator, (req, res) => {
        const body = req.body;
        console.log(body);
        const user = body.user;
        const id = body.id;
        const data = {text: body.text, title: body.title};

        console.log(data, id, user);
        if (Object.keys(data).length === 0) {
            return res.send(400, { error: "nothing to update" });
        }
        Notes.updateOne({ user, _id: id }, { $set: data }, (err, doc) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            return res.json({ success: true, message: "success", result: doc });
        });
    });

    app.post('/notes', (req, res) => {
        const body = req.body;
        const text = body.text;
        const title = body.title;
        const user = req.user._id;

        //TODO: validation?
        const note = new Notes();
        note.user = user;
        note.text = text;
        note.title = title;

        note.save((err, doc) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            return res.json({ message: "success", result: doc });
        });
    });

    app.delete('/notes', (req, res) => {
        const body = req.body;
        const user = req.user._id;
        const id = body.id;
        console.log(id);
        Notes.deleteOne({ user, _id: id }, (err, doc) => {
            console.log(doc);
            if (err) {
                return res.status(500).json({ error: err });
            }
            return res.json({ message: "success", result: doc });
        });
    });

    //update it's text
    app.patch('/notes', (req, res) => {
        const body = req.body;
        const user = req.user._id;
        const id = body.id;
        const data = {};
        if (body.text) {
            data.text = body.text;
        }
        if (body.title) {
            data.title = body.title;
        }
        console.log(data, id);
        if (Object.keys(data).length === 0) {
            return res.send(400, { error: "nothing to update" });
        }
        Notes.updateOne({ user, _id: id }, { $set: data }, (err, doc) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            return res.json({ message: "success", result: doc });
        });
    });
};