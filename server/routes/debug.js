// this isn't really useful, just for testing purposes.
const os = require('os-utils');

module.exports = function (app) {
    app.get('/debug', async function (req, res) {
        let loadavg1 = await os.loadavg(1);
        let loadavg5 = await os.loadavg(5);
        let loadavg15 = await os.loadavg(15);
        const platform = await os.platform();
        const used = await process.memoryUsage();
        const nodever = await process.version;
        const payload = {platform, nodever, usage: {cpu: {loadavg1, loadavg5, loadavg15}, memory: {}}}
        for (let key in used) {
            payload.usage.memory[key] = `${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`;
        }
        res.json(payload);
    });
}