const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * tracks what cryptos a user is interested in to show a more personalised dashboard.
 * user: Strazdonis
 * crypto: [BTC, ETH, LTC]
 */
const CryptoSchema = new Schema({
    user: {type: Schema.ObjectId, ref: 'User', required: true},
    crypto: [{type: String}]
});

module.exports = mongoose.model('Crypto', CryptoSchema);