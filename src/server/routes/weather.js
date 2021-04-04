const { auth } = require('../utils/middlewares');
module.exports = (app) => {
    app.get('/calendar', auth.required, (req, res) => {
        res.render('calendar', { layout: 'index' });
    });
};