const mongoose = require('mongoose');

const dataSchema = mongoose.Schema({
    name: String,
    userID: String,
    lb: String,
    level: Number,
    class: String,
    posX: Number,
    posY: Number,
    hp: Number,
    maxHp: Number,
    mp: Number,
    maxMp: Number,
    atk: Number,
    def: Number,
    dateSummoned: Number,
    lastRecovered: Number,
    lastCollected: Number,
    lastCollectedHidden: Number,
    testObject: Object,


})

module.exports = mongoose.model('RpgData', dataSchema);