const { auth } = require('../utils/middlewares');
module.exports = (app) => {
    app.get('/todo', auth.required, (req, res) => {
        res.render('todo', { layout: 'index' });
    });
};