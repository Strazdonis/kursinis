const axios = require("axios");
const logger = require("../logger");
module.exports = {
    fetch: async (url) => {
        
        try {
            const response = await axios.get(url);
            const data = response.data;
            return data;
        } catch (error) {
            logger.error(error.stack);
            return error;
        }
    },

};