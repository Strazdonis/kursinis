const Calendar = require("../../models/calendar");
const { auth } = require('../../utils/middlewares');
module.exports = (app) => {
    app.get('/calendar-data', auth.required, (req, res) => {
        const user = req.user._id;
        Calendar.find({ user: user }).then((data, err) => {

            // mongo stores ids in _id, we need id
            data = data?.map(row => {
                row.id = row._id;
                return row;
            });
            res.send(data);
        });
    });
    app.post('/calendar-data', function (req, res) {
        const data = req.body;
        const user = req.user._id;
        data.user = user;
        //get operation type
        let mode = data["!nativeeditor_status"];
        //get id of record
        const sid = data.id;
        let tid = sid;
        /* jshint ignore:start */
        data.eventId = data.eventId ?? tid;
        /* jshint ignore:end */
        //remove properties which we do not want to save in DB
        delete data.id;
        delete data["!nativeeditor_status"];


        //output confirmation response
        function update_response(err, result) {
            if (err)
                mode = "error";
            else if (mode == "inserted")
                tid = data._id;

            res.setHeader("Content-Type", "application/json");
            res.send({ action: mode, sid: sid, tid: tid });

        }

        //run db operation
        if (mode == "updated") {
            Calendar.updateOne({ eventId: data.eventId }, data, update_response);
        }
        else if (mode == "inserted") {
            Calendar.create(data, update_response);
        }
        else if (mode == "deleted") {
            Calendar.deleteOne({ eventId: data.eventId }, update_response);
        }
        else {
            res.send("Not supported operation");
        }
    });
};