/* jshint esversion: 9 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
//TODO: validation,hashing,everything (handle with passport?)

/**
 * main user object
 * username: Strazdonis
 * password: hashed
 * salt: salt user for password hashing
 * fullname: Edvinas Strazdonis
 * city: Vilnius (detect by IP GEOlocation?)
 */
const UserSchema = new Schema({
    fullname: { type: String, required: true },
    city: { type: String }, //for weather
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);