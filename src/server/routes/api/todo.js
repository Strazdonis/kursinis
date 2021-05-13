const Todo = require('../../models/todo');
module.exports = (app) => {
    app.get('/todo', (req, res) => {
        const user = req.user._id;
        Todo.find({ user: user }, (err, doc) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            return res.json({ message: "success", result: doc });
        });
    });

    app.post('/todo', (req, res) => {
        const body = req.body;
        const task = body.task;
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
            return res.json({ message: "success", result: doc });
        });
    });

    app.delete('/todo', (req, res) => {
        const body = req.body;
        const user = req.user._id;
        const id = body.id;
        Todo.deleteOne({ _id: id }, (err, doc) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            return res.json({ message: "success", result: doc });
        });
    });

    //update it's status or text
    app.patch('/todo', (req, res) => {
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
        if (Object.keys(data).length === 0) {
            return res.send(400, { error: "nothing to update" });
        }
        Todo.updateOne({ id }, { $set: data }, (err, doc) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            return res.json({ message: "success", result: doc });
        });
    });
};