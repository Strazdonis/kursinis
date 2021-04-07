const { auth } = require('../utils/middlewares');
module.exports = (app) => {
    app.get('/settings', auth.required, (req, res) => {
        res.render('settings', { layout: 'index' });
    });
};