const Notes = require('../../models/notes');
const { auth } = require('../../utils/middlewares');
const xssFilters = require('xss-filters');
module.exports = (app) => {
    app.get('/notes', auth.required, (req, res) => {
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
            return res.json({ success: true, message: "success", result: doc });
        });
    });

    app.get('/notes/fake', auth.moderator, (req, res) => {
        const notes = Notes.fake(100);
        console.log(notes);
        notes.forEach(note => {
            note.save();
        });
    });

    app.get('/notes/new', auth.moderator, (req, res) => {
        Notes.find({}).sort({ 'date': -1 }).limit(5).exec((err, doc) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            return res.json({ success: true, message: "success", result: doc });
        });
    });

    //update it's text
    app.put('/notes/:user_id', auth.moderator, (req, res) => {
        const body = req.body;
        const id = body.id;
        const data = { text: xssFilters.inHTMLData(body.text), title: xssFilters.inHTMLData(body.title) };

        if (Object.keys(data).length === 0) {
            return res.status(400).json({ error: "nothing to update" });
        }
        Notes.updateOne({ _id: id }, { $set: data }, (err, doc) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            return res.json({ success: true, message: "success", result: doc });
        });
    });

    app.post('/notes', auth.required, (req, res) => {
        const body = req.body;
        const text = body.text;
        const title = body.title;
        const user = req.user._id;

        const note = new Notes();
        note.user = user;
        note.text = xssFilters.inHTMLData(text);
        note.title = xssFilters.inHTMLData(title);

        note.save((err, doc) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            return res.json({ success: true, message: "success", result: doc });
        });
    });

    app.delete('/notes', auth.required, (req, res) => {
        const body = req.body;
        const user = req.user._id;
        const id = body.id;

        Notes.deleteOne({ user, _id: id }, (err, doc) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            return res.json({ success: true, message: "success", result: doc });
        });
    });

    app.delete('/notes/:id', auth.moderator, (req, res) => {
        const body = req.params;
        const id = body.id;
        Notes.deleteOne({ _id: id }, (err, doc) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            return res.json({ message: "success", success: true, result: doc });
        });
    });

    //update it's text
    app.patch('/notes', auth.required, (req, res) => {
        const body = req.body;
        const user = req.user._id;
        const id = body.id;
        const data = {};
        if (body.text) {
            data.text = xssFilters.inHTMLData(body.text);
        }
        if (body.title) {
            data.title = xssFilters.inHTMLData(body.title);
        }
        const errors = {};
        // mongoose doesnt validate on update requests, validate manually
        if (body.text == "" || body.text.trim() == "" || data.text == "" || data.text.trim() == "") {
            // match mongoose error format
            errors.text = { message: "Text field is required" };
        }
        if (body.title == "" || body.title.trim() == "" || data.title == "" || data.title.trim() == "") {
            // match mongoose error format
            errors.title = { message: "Title field is required" };
        }
        if (errors.text || errors.title) {
            return res.status(400).json({ error: { errors } });
        }
        if (Object.keys(data).length === 0) {
            return res.status(400).json({ error: "nothing to update" });
        }
        Notes.updateOne({ user, _id: id }, { $set: data }, (err, doc) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            return res.json({ success: true, message: "success", result: doc });
        });
    });
};