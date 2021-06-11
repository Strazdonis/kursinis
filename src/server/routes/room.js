const { auth } = require('../utils/middlewares');
module.exports = (app) => {
    app.get('/room/:room', auth.required, (req, res) => {
        res.render('room', { layout: 'index' });
    });
};