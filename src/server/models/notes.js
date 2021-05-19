const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.plugin(require('@lykmapipo/mongoose-faker'));
const users = ['607614e429c38f1dc4f3d7cc', '607a04b32602cb398436a504', '607a05458a68552ef4118cba', '6092c712343d29670883bbff', '60a4f706ceea1f0914be96b7'];
const words = ["monitor", "program", "application", "keyboard", "javascript", "gaming", "network", "programming", "university", "tasks", "sport", "banana"];
getRandom = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
};
/**
 * acts as 1 note.
 * user: Strazdonis
 * text: recipe for buckwheat: ...
 */
const NotesSchema = new Schema({
    user: { type: Schema.ObjectId, ref: 'User', required: true, fake: () => { return getRandom(users); } },
    title: { type: String, required: "Title field is required", trim: true, fake: { generator: 'name', type: 'firstName' }  },
    text: { type: String, required: "Text field is required", trim: true, fake: () => { return [1,2,3,4,5].map(n => n = getRandom(words)).join(" "); } },
    date: { type: Date, default: Date.now, fake: {generator: 'date'} },
});

module.exports = mongoose.model('Notes', NotesSchema);