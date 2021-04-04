const { auth } = require('../utils/middlewares');
module.exports = (app) => {
    app.get('/weather', auth.required, (req, res) => {
        res.render('weather', { layout: 'index' });
    });
};