const mongoose = require('mongoose');

const connectDb = () => {
    return mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true, });
};

const models = { Calendar: require('./calendar'), Crypto: require('./crypto'), User: require('./user') };

module.exports = { connectDb, models };
