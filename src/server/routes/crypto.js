module.exports = (app) => {
    app.get('/crypto', (req, res) => {
        res.render('crypto', { layout: 'index' });
    });
};