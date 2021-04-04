module.exports = (app) => {
    app.get('/weather', (req, res) => {
        res.render('weather', { layout: 'index' });
    });
};