const mongoose = require('mongoose');

const dataSchema = mongoose.Schema({
    name: String,
    userID: String,
    guess: Number,
    checkable: Boolean

})

module.exports = mongoose.model('LuckyNumData', dataSchema);