module.exports = (app) => {
    app.get('/news', (req, res) => {
        res.render('news', { layout: 'index' });
    });
};