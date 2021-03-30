const Todo = require('../models/todo');
module.exports = function (app) {

    app.get('/todo', (req, res) => {
        res.render('todo', { layout: 'index' });
    });

    app.get('/api/todo', (req, res) => {
        const user = req.user._id;
        Todo.find({ user: user }, (err, doc) => {
            if (err) {
                return res.send(500, { error: err });
            }
            return res.json({ message: "success", result: doc });
        });
    });

    app.post('/api/todo', (req, res) => {
        const body = req.body;
        const task = body.task;
        const user = req.user._id;

        //TODO: validation?
        const todo = new Todo();
        todo.user = user;
        todo.task = task;
        todo.state = "active";

        Todo.save((err, doc) => {
            if (err) {
                return res.send(500, { error: err });
            }
            return res.json({ message: "success", result: doc });
        });
    });

    app.delete('/api/todo', (req, res) => {
        const body = req.body;
        const user = req.user._id;
        const id = body.id;
        Todo.deleteOne({ user, id }, (err, doc) => {
            if (err) {
                return res.send(500, { error: err });
            }
            return res.json({ message: "success", result: doc });
        });
    });

    //update it's status or text
    app.patch('/api/todo', (req, res) => {
        const body = req.body;
        const user = req.user._id;
        const id = body.id;
        const data = {};
        if (body.task) {
            data.task = body.task;
        }
        if (body.status) {
            data.status = body.status;
        }
        if (Object.keys(obj).length === 0) {
            return res.send(400, { error: "nothing to update" });
        }
        Todo.updateOne({ id }, { $set: data }, (err, doc) => {
            if (err) {
                return res.send(500, { error: err });
            }
            return res.json({ message: "success", result: doc });
        });
    });
};