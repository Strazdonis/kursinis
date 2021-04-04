const { auth } = require('../utils/middlewares');
module.exports = (app) => {
    app.get('/crypto', auth.required, (req, res) => {
        res.render('crypto', { layout: 'index' });
    });
};