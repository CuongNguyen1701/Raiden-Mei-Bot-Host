
const mongoose = require('mongoose');

const set = require(`./calc_set.js`)
//CONNECT TO DATABASE
mongoose.connect(process.env.mongoPass, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(err => console.log(err));

//MODELS
const CalcData = require('../models/calcdata.js');


module.exports = {
    name: 'add',
    description: 'add the value to the buff',
    execute(client, message, args) {
        let user = message.author;
        function SaveData(data) { data.save().catch(err => console.log(err)); }
        CalcData.findOne({
            userID: user.id
        }, (err, calcData) => {
            if (!calcData) {
                var newData = new CalcData({
                    name: client.users.cache.get(user.id).username,
                    userID: user.id,
                    lv: 80,
                    atk: 1000,
                    crt: 100,
                    bonus_crit: 0,
                    tdm: 0,
                    tdm_r: 0,
                    phys: 0,
                    phys_r: 0,
                    cdm: 0,
                    ele: 0,
                    ele_r: 0,
                })
                SaveData(newData);
            }
            let data = newData || calcData;

            if (isNaN(args[1])) return message.reply(`please use a number`)
            let correctInput = true;
            var newValue;
            let addition = Math.floor(args[1])
            switch (args[0]) {
                case 'lv': case 'level':
                    if (addition > 80) return message.reply(`please enter a whole number between 1 to 80 for valkyrie's level`)
                    data.lv = parseInt(data.lv) + addition;
                    if (data.lv > 80) data.lv = 80;
                    newValue = data.lv;
                    break;
                case 'atk': case 'attack':
                    data.atk = parseInt(data.atk) + addition;
                    newValue = data.atk;
                    break;
                case 'crt':
                    data.crt = parseInt(data.crt) + addition;
                    newValue = data.crt
                    break;
                case 'tdm':
                    data.tdm = parseInt(data.tdm) + addition;
                    newValue = data.tdm
                    break;
                case 'tdm_r': case 'tdmr':
                    data.tdm_r = parseInt(data.tdm_r) + addition;
                    newValue = data.tdm_r
                    break;
                case 'phys':
                    data.phys = parseInt(data.phys) + addition;
                    newValue = data.phys
                    break;
                case 'phys_r': case 'physr':
                    data.phys_r = parseInt(data.phys_r) + addition;
                    newValue = data.phys_r
                    break;
                case 'cdm': case 'crit_damage': case 'crit_dmg':
                    data.cdm = parseInt(data.cdm) + addition;
                    newValue = data.cdm
                    break;
                case 'ele':
                    data.ele = parseInt(data.ele) + addition;
                    newValue = data.ele
                    break;
                case 'ele_r': case 'ele_r':
                    data.ele_r = parseInt(data.ele_r) + addition;
                    newValue = data.ele_r
                    break;
                case 'bonus_crit':
                    data.bonus_crit = parseInt(data.bonus_crit) + addition;
                    newValue = data.bonus_crit
                    break;
                default:
                    correctInput = false;
                    message.reply(`please use the correct syntax!`);
                    break;
            }
            SaveData(data);
            if (correctInput) message.channel.send(`${args[0]} is set to ${newValue}`);

        })
    }

}