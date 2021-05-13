const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * acts as 1 note.
 * user: Strazdonis
 * text: recipe for buckwheat: ...
 */
const NotesSchema = new Schema({
    user: { type: Schema.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true, trim: true },
});

module.exports = mongoose.model('Notes', NotesSchema);