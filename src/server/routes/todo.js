module.exports = (app) => {
    app.get('/todo', (req, res) => {
        res.render('todo', { layout: 'index' });
    });
};