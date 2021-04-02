const fs = require('fs');
module.exports = {

    getNonce: function (req, res) {
        return `'nonce-${res.locals.nonce}'`;
    },

    getDirectives: function () {
        const self = `'self'`;
        const unsafeInline = `'unsafe-inline'`;
        const scripts = [
        ];
        const styles = [
            'https://ka-f.fontawesome.com/',
            'https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css',
            'https://fonts.googleapis.com',

        ];
        const fonts = [
            `https://fonts.gstatic.com/`,
        ];
        const frames = [

        ];
        const images = [

        ];
        const connect = [
            "https://api.coincap.io/",
        ];

        return {
            defaultSrc: [self],
            scriptSrc: [self, this.getNonce, ...scripts],
            styleSrc: [self, unsafeInline, ...styles],
            fontSrc: [self, ...fonts],
            frameSrc: [self, ...frames],
            connectSrc: [self, ...connect],
            imgSrc: [self, ...images],
            objectSrc: [self],

            // breaks pdf in chrome:
            // https://bugs.chromium.org/p/chromium/issues/detail?id=413851
            // sandbox: [`allow-forms`, `allow-scripts`, `allow-same-origin`],
        };
    },

    loadRoutes: function (routePath, router, dir) {
        fs.readdirSync(routePath).forEach(function (file) {
            if(!file.includes('.js')) return;
            const route = routePath + file;
            require(`../${route}`)(router);
            //print nicely to console to see all routes
            console.log(`[${dir}]${dir==="API"?"  ":""} ${dir === "API" ? "/api/" : "/"}${file}`);
        });
    },


};