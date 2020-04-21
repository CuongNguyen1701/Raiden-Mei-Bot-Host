const mongoose = require('mongoose');

const dataSchema = mongoose.Schema({
    name: String,
    userID: String,
    lb: String,
    money: Number,
    pMoney: Number,
    faction: String,
    daily: Number,
    investMoney: Number,
    investTime: Number,
    investCD: Boolean,
    investStonks: Boolean,
    coup: Number,
})

module.exports = mongoose.model('Data', dataSchema);