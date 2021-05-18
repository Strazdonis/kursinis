const { auth } = require('../../utils/middlewares');
module.exports = (router) => {
    router.get('/', auth.moderator, function (req, res) {
        res.render('dashboard', { layout: 'admin' });
    });
};