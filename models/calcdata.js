const mongoose = require('mongoose');

const dataSchema = mongoose.Schema({
    name: String,
    userID: String,
    lv: Number,
    atk: Number,
    crt: Number,
    bonus_crit: Number,
    tdm: Number,
    tdm_r: Number,
    phys: Number,
    phys_r: Number,
    cdm: Number,
    ele: Number,
    ele_r: Number,


})

module.exports = mongoose.model('CalcData', dataSchema);