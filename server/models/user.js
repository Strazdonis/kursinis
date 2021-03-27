/* jshint esversion: 9 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//TODO: validation,hashing,everything (handle with passport?)

/**
 * main user object
 * username: Strazdonis
 * password: hashed
 * city: Vilnius (detect by IP GEOlocation?)
 */
const UserSchema = new Schema({
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    city: { type: String }, //for weather
});

module.exports = mongoose.model('User', UserSchema);