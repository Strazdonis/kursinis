const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * acts as 1 todo task, stores it's state and task itself
 * user: Strazdonis
 * task: clean the dishes
 * state: active
 */
const TodoSchema = new Schema({
    user: { type: Schema.ObjectId, ref: 'User', required: true },
    task: { type: String, required: 'Task field is required', trim: true },
    state: { type: String, enum: ['active', 'completed', 'removed'] }
});

module.exports = mongoose.model('Todo', TodoSchema);