const { auth } = require('../../utils/middlewares');
const Crypto = require('../../models/crypto'),
Users = require('../../models/user'),
Notes = require('../../models/notes'),
Todo = require('../../models/todo');
module.exports = (app) => {
    
    app.get('/stats', auth.moderator, (req, res) => {
        const stats = {};
        const promises = [];
        promises.push(Users.estimatedDocumentCount({}, function(err, count) {
            stats.users = count || 0;
        }));
        promises.push(Notes.estimatedDocumentCount({}, function(err, count) {
            stats.notes = count || 0;
        }));
        promises.push(Todo.estimatedDocumentCount({}, function(err, count) {
            stats.todo = count || 0;
        }));
        promises.push(Crypto.estimatedDocumentCount({}, function(err, count) {
            stats.crypto = count || 0;
        }));
        Promise.all(promises).then(data => {
            console.log(data);
            res.json(stats);
        });
        
    });
};