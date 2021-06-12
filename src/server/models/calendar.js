const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * tracks events for calendar.
 * user: Strazdonis
 * event: Matematikos egzaminas
 * time: 1616887801104 (unix timestamp OR 2021-03-28T20:36:59.414Z)
 */
const CalendarSchema = new Schema({
    user: { type: Schema.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true, trim: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    eventId: { type: String, required: true },
    color: { type: String },
});

module.exports = mongoose.model('Calendar', CalendarSchema);