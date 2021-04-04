module.exports = (app) => {
    app.get('/notes', (req, res) => {
        res.render('notes', { layout: 'index' });
    });
};