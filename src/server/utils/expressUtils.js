const fs = require('fs');
const path = require('path');
const logger = require("../logger");
var start = process.hrtime();
const cache = new Map();

module.exports = {

    getNonce: function (req, res) {
        return `'nonce-${nonce}'`;
    },

    getDirectives: function () {
        const self = `'self'`;
        const unsafeInline = `'unsafe-inline'`;
        const unsafeEval = `'unsafe-eval'`;
        const scripts = [
            'https://uicdn.toast.com',
            'https://cdn.datatables.net',
            'http://cdn.jsdelivr.net/npm/sweetalert2@11',
            'https://cdn.jsdelivr.net/npm/sweetalert2@11',
            'https://unpkg.com/peerjs@1.2.0/dist/peerjs.min.js',
        ];
        const styles = [
            'https://uicdn.toast.com',
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
            'data:',
            'img-src *'
        ];
        const connect = [
            "https://api.coincap.io/",
            "wss://0.peerjs.com/peerjs",
            "https://0.peerjs.com"
        ];
        const prettyNonce = `'nonce-${nonce}'`;
        return {
            defaultSrc: [self],
            scriptSrc: [self, unsafeInline, unsafeEval,...scripts],
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
            if (!file.includes('.js')) return;
            const route = routePath + file;
            require(path.join("../", route))(router);
            //print nicely to console to see all routes
            logger.info(`[${dir}]${dir === "API" ? "  " : ""} ${dir === "API" ? "/api/" : "/"}${file}`);
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



    getHtml: path => new Promise((resolve, reject) =>
        fs.readFile(path, 'utf-8', (err, contents) => {
            if (err) return reject(err);

            cache.set(path, contents);
            return resolve(contents);
        })
    ),

    csp: page => async (req, res, next) => {
        const dirViews = "views/"
        const pagePath = path.join(dirViews, page);
        let html = cache.get(pagePath);
        if (!html) {
            html = await getHtml(pagePath);
        }
        newHTML = html.replace(/<script/g, `<script nonce="${nonce1}"`)
            .replace(/<style/g, `<style nonce="${nonce1}"`);
        res.send(newHTML);
    }

};