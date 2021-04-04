module.exports = (app) => {
    app.get('/calendar', (req, res) => {
        res.render('calendar', { layout: 'index' });
    });
};