const { auth } = require('../../utils/middlewares');
module.exports = (app) => {
    app.post('/logout', auth.required, (req, res) => {
        req.logout();
        res.redirect('/');
    });
};