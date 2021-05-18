const { auth } = require('../../utils/middlewares');
module.exports = (router) => {
    router.get('/tables/:table', auth.moderator, function (req, res) {
        const table = req.params.table;

        res.render(`table_${table}`, { layout: false });
    });
};