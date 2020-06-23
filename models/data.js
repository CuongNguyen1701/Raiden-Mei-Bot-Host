const mongoose = require('mongoose');

const dataSchema = mongoose.Schema({
    name: String,
    userID: String,
    lb: String,
    level: Number,
    class: String,
    pos: { x: Number, y: Number, },
    stats:
    {
        hp: Number, maxHp: Number,
        mp: Number, maxMp: Number,
        atk: Number, def: Number,
    }
})

module.exports = mongoose.model('Data', dataSchema);