const { auth } = require('../utils/middlewares');
const { csp } = require("../utils/expressUtils");
module.exports = (app) => {
    app.get('/', auth.required, (req, res) => {
        console.log(nonce)
        res.render('main', { layout: 'index' });
    });
};