const Notes = require('../../models/notes');
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
        Notes.deleteOne({ _id: id }, (err, doc) => {
            console.log(doc)
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
        if(body.title) {
            data.title = body.title;
        }
        console.log(data, id)
        if (Object.keys(data).length === 0) {
            return res.send(400, { error: "nothing to update" });
        }
        Notes.updateOne({ _id: id }, { $set: data }, (err, doc) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            return res.json({ message: "success", result: doc });
        });
    });
};