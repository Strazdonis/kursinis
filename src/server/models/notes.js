const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * acts as 1 note.
 * user: Strazdonis
 * text: recipe for buckwheat: ...
 */
const NotesSchema = new Schema({
    user: { type: Schema.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    text: { type: String, required: true, trim: true },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Notes', NotesSchema);