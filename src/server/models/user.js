const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const validateEmail = (email) => {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};

/**
 * main user object
 * displayname: Strazdonis
 * firstname: Edvinas
 * lastname: Strazdonis
 * fullname: Edvinas Strazdonis (firstname + lastname)
 * city: Vilnius (detect by IP GEOlocation?)
 * email: edvinasstrazdonis@gmail.com
 * perms: normal/admin - user permission level
 * verified: true/false - whether email was verified or not
 * code: code for email verification
 * forgotcode: code for forgot password validation
 * password: hashed
 * salt: salt used for password hashing
 */
const UserSchema = new Schema({
    displayname: { type: String, },
    firstname: { type: String, required: "First name is required", },
    lastname: { type: String, required: "Last name is required" },
    city: { type: String, trim: true, }, //for weather
    country: { type: String, trim: true, },
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
    forgotcode: { type: String },
    verified: { type: Boolean, default: false }
});

UserSchema.virtual('fullname').
    get(function () { return `${this.firstname} ${this.lastname}`; }).
    set(function (v) {
        // `v` is the value being set, so use the value to set
        // `firstName` and `lastName`.
        const firstname = v.substring(0, v.indexOf(' '));
        const lastname = v.substring(v.indexOf(' ') + 1);
        this.set({ firstname, lastname });
    });

    // https://github.com/saintedlama/passport-local-mongoose#options
UserSchema.plugin(passportLocalMongoose, {
});

module.exports = mongoose.model('User', UserSchema);