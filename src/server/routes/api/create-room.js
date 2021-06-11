const { v4: uuidV4 } = require('uuid');

module.exports = (app) => {
    app.get('/create-room', (req, res) => {
        // TODO: generate nicer ids, this is hard to share
        let id = uuidV4();
        // makes sure it's unique
        while(rooms.includes(id)) {
            id = uuidV4();
        }
        return res.json(id);
    });      
};