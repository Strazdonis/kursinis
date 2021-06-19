const API_KEY = "f3f9dd52e7331d47b19833dfa278c1de";
const User = require("../../models/user.js")
const { fetch } = require("../../utils/utils.js");
const baseURL = "https://api.openweathermap.org/data/2.5";
const logger = require("../../logger");
const { auth } = require('../../utils/middlewares');
module.exports = (app) => {
    app.get(`/weather/:city`, auth.required, async (req, res) => {
        city = req.params.city;
        if(city == "me") {
            if(!req.user.city || req.user.city == "undefined") {
                return;
            }
            city = req.user.city;
        }
        const url = `${baseURL}/weather?q=${city}&appid=${API_KEY}&units=metric`;
        const response = await fetch(url);
        if(response && (!req.user.city || req.user.city == "undefined")) {
            User.findOneAndUpdate({ _id: req.user._id }, { city: city }, {}, (err, doc) => {
                if(err){
                    return logger.error(`Failed smart setting user ${req.user._id} city to ${city} ${err.stack}`);
                }
                logger.info(`Smart set user (${req.user._id}) city to ${city}`);
            });
        }
        return res.json(response);
    });
};