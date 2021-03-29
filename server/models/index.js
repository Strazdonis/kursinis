const mongoose = require('mongoose');

const connectDb = () => {
    return mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
};

const models = {  };

module.exports = { connectDb, models };
