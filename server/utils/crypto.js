const { fetch } = require("./utils");
const baseURL = "https://api.coincap.io/v2";
module.exports = {
    getOneCryptoData: async (crypto) => {
        const url = `${baseURL}/assets/${crypto}`;
        return await fetch(url);
    },
    getManyCryptoData: async (ids) => {
        // const ids = array.join(",");
        const url = `${baseURL}/assets?ids=${ids}`;
        return await fetch(url);
    },
};