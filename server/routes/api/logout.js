module.exports = (app) => {
    app.post('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });
};