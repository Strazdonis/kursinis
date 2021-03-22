module.exports = function (app) {
    app.get('/crypto', (req, res) => {
        //Serves the body of the page aka "main.handlebars" to the container //aka "index.handlebars"
        res.render('crypto', { layout: 'index' });
    });
};