const { auth } = require('../utils/middlewares');
module.exports = (app) => {
    app.get('/news', auth.required, (req, res) => {
        res.render('news', { layout: 'index' });
    });
};