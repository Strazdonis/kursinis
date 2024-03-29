const mongoose = require('mongoose');

const connectDb = () => {
    return mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true, });
};

module.exports = { connectDb };
