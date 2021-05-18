const { auth } = require('../../utils/middlewares');
module.exports = (router) => {
    router.get('/tables/:table', auth.moderator, function (req, res) {
        const table = req.params.table;
        if(table == 'users' && req.user.perms != "admin") {
            return res.redirect('/admin/');
        }
        res.render(`table_${table}`, { layout: null });
    });
};