const { auth } = require('../utils/middlewares');
module.exports = (app) => {
    app.get('/room/:room', auth.required, (req, res) => {
        res.render('room', { layout: 'index',
            partials: Promise.resolve({
                script: hbs.handlebars.compile(`<script nonce="${nonce}">
                    const my_name = "{{session.fullname}}"
                </script>`)
            })
        });
    });
};