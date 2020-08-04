const mongoose = require('mongoose');
mongoose.set('debug', true);

const dataSchema = mongoose.Schema({
    name: String,
    userID: String,
    guess: Number,
    checkable: Boolean

})

module.exports = mongoose.model('LuckyNumberData', dataSchema);