const { v4: uuidV4 } = require('uuid');

module.exports = (app) => {
    app.get('/create-room', (req, res) => {
        // first makes a room id from creator's full name, then from creator's id and then a random one.
        let id = req.user.fullname.replace(/\s/g, "_");
        if(rooms.includes(id)) {
            id = req.user._id;
        }
        // makes sure it's unique
        while(rooms.includes(id)) {
            id = uuidV4();
        }
        return res.json(id);
    });      
};