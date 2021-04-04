const { auth } = require('../utils/middlewares');
module.exports = (app) => {
    app.get('/', auth.required, (req, res) => {
        res.render('main', { layout: 'index' });
    });
};