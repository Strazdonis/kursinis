const fs = require('fs');
const path = require('path');
const logger = require("../logger");
var start = process.hrtime();
module.exports = {

    getNonce: function (req, res) {
        return `'nonce-${res.locals.nonce}'`;
    },

    getDirectives: function () {
        const self = `'self'`;
        const unsafeInline = `'unsafe-inline'`;
        const scripts = [
            'https://cdn.datatables.net',
            'http://cdn.jsdelivr.net/npm/sweetalert2@11',
            'https://cdn.jsdelivr.net/npm/sweetalert2@11'
        ];
        const styles = [
            'https://ka-f.fontawesome.com/',
            'https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css',
            'https://fonts.googleapis.com',
            'https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css',
            'https://cdn.datatables.net/v/bs4-4.1.1/jq-3.3.1/dt-1.10.24/date-1.0.3/r-2.2.7/datatables.min.css',

        ];
        const fonts = [
            `https://fonts.gstatic.com/`,
            'https://code.ionicframework.com/ionicons/2.0.1/fonts/'
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
            require(path.join("../", route))(router);
            //print nicely to console to see all routes
            logger.info(`[${dir}]${dir==="API"?"  ":""} ${dir === "API" ? "/api/" : "/"}${file}`);
        });
    },

    checkDotEnv: () => {
        return process.env.ENV_EXISTS;
    },

    // based on https://stackoverflow.com/questions/10617070/how-do-i-measure-the-execution-time-of-javascript-code-with-callbacks
    elapsedTime: (note) => {
        var precision = 3; // 3 decimal places
        var elapsed = process.hrtime(start)[1] / 1000000; // divide by a million to get nano to milli
        logger.verbose(process.hrtime(start)[0] + " s, " + elapsed.toFixed(precision) + " ms - " + note); // print message + time
        start = process.hrtime(); // reset the timer
    },


};