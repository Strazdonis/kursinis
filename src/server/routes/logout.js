const { auth } = require('../utils/middlewares');
module.exports = (app) => {
    app.get('/logout', auth.required, (req, res) => {
        req.logout();
        res.redirect('/login');
    });
};