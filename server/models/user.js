const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
//TODO: validation,hashing,everything (handle with passport?)

const validateEmail = (email) => {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};

/**
 * main user object
 * username: Strazdonis
 * password: hashed
 * salt: salt user for password hashing
 * email: edvinasstrazdonis@gmail.com
 * verified: wether email was verified or not
 * fullname: Edvinas Strazdonis
 * city: Vilnius (detect by IP GEOlocation?)
 */
const UserSchema = new Schema({
    fullname: { type: String, required: true },
    city: { type: String }, //for weather
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    perms: { type: String, enum: ["normal", "admin"], default: "normal" },
    code: { type: String },
    verified: { type: Boolean, default: false }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);