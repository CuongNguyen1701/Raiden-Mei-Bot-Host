const mongoose = require('mongoose');

const coupDataSchema = mongoose.Schema({
    coupID: String,
    refreshTime: Number,
    coupValue: Number,
})

module.exports = mongoose.model('CoupData', coupDataSchema);