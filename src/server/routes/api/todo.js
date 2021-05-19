const Todo = require('../../models/todo');
const { auth } = require('../../utils/middlewares');
const xssFilters = require('xss-filters');
module.exports = (app) => {
    app.get('/todo', (req, res) => {
        const user = req.user._id;
        Todo.find({ user: user }, (err, doc) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            return res.json({ success: true, message: "success", result: doc });
        });
    });

    app.get('/todo/all', auth.moderator, (req, res) => {
        Todo.find({}, (err, doc) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            return res.json({ success: true, message: "success", result: doc });
        });
    });

    app.put('/todo/:anything', (req, res) => {
        const body = req.body;
        const user = body.user;
        const id = body.id;
        const data = {};

        data.task = xssFilters.inHTMLData(body.task);

        data.state = xssFilters.inHTMLData(body.state);
        if (Object.keys(data).length === 0) {
            return res.status(400).json({ error: "nothing to update" });
        }
        Todo.updateOne({ user, _id: id }, { $set: data }, (err, doc) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            return res.json({ success: true, message: "success", result: doc });
        });
    });

    app.delete('/todo/:id', (req, res) => {
        const body = req.body;
        const id = body.id;
        Todo.deleteOne({ _id: id }, (err, doc) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            return res.json({ success: true, message: "success", result: doc });
        });
    });

    app.post('/todo', (req, res) => {
        const body = req.body;
        const task = xssFilters.inHTMLData(body.task);
        const user = req.user._id;

        //TODO: validation?
        const todo = new Todo();
        todo.user = user;
        todo.task = task;
        todo.state = "active";

        todo.save((err, doc) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            return res.json({ success: true, message: "success", result: doc });
        });
    });

    app.delete('/todo', (req, res) => {
        const body = req.body;
        console.log(body);
        const user = req.user._id;
        const id = body.id;
        console.log(user, id);
        Todo.deleteOne({ user, _id: id }, (err, doc) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            return res.json({ success: true, message: "success", result: doc });
        });
    });

    //update it's status or text
    app.patch('/todo', (req, res) => {
        const body = req.body;
        const user = req.user._id;
        const id = body.id;
        const data = {};
        if (body.task) {
            data.task = xssFilters.inHTMLData(body.task);
        }
        if (body.state) {
            data.state = xssFilters.inHTMLData(body.state);
        }
        console.log(body);
        console.log(user, id, data);
        if (Object.keys(data).length === 0) {
            return res.status(400).json({ error: "nothing to update" });
        }
        Todo.updateOne({ user, _id: id }, { $set: data }, (err, doc) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            return res.json({ success: true, message: "success", result: doc });
        });
    });
};