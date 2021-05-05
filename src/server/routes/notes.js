const { auth } = require('../utils/middlewares');
module.exports = (app) => {
    app.get('/notes', auth.required, (req, res) => {
        res.render('notes', { layout: 'index' });
    });
};