let Parser = require('rss-parser');
let parser = new Parser();
const logger = require('../../logger');
module.exports = async (app) => {
    app.get('/news/:feed', async (req, res) => {
        const feeds = {
            "bbc": "http://feeds.bbci.co.uk/news/rss.xml",
            "15min": "https://www.15min.lt/rss",
            "delfi": "https://www.delfi.lt/rss/",
            "custom": req.query.feedurl,
        };
        const param = req.params.feed;
        if (!param || (param == "custom" && !req.query.feedurl)) return res.status(401).json({ error: true, message: "Invalid feed" });
        const url = feeds[param];
        let feed;
        try {
            feed = await parser.parseURL(url);
        } catch (err) { 
            logger.error(`Failed parsing rss feed\nParams: ${JSON.stringify(req.params)}\nQuery: ${JSON.stringify(req.query)}\nUser: ${req.session.passport.user}\nStack: ${err.stack}`);
            return res.status(500).json({ error: true, message: "something went wrong" });
        }
        return res.json(feed.items);
    });
};