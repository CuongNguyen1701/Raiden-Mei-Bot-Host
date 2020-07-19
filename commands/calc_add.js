
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
            switch (args[0]) {
                case 'lv': case 'level':
                    if (args[1] > 80) return message.reply(`please enter a whole number between 1 to 80 for valkyrie's level`)
                    args[1] = Math.floor(args[1]);
                    data.lv += args[1];
                    if (data.lv > 80) data.lv = 80;
                    newValue = data.lv;
                    break;
                case 'atk': case 'attack':
                    args[1] = Math.floor(args[1]);
                    data.atk += args[1];
                    newValue = data.atk;
                    break;
                case 'crt':
                    args[1] = Math.floor(args[1]);
                    data.crt += args[1];
                    newValue = data.crt
                    break;
                case 'tdm':
                    data.tdm += args[1];
                    newValue = data.tdm
                    break;
                case 'tdm_r':
                    data.tdm_r += args[1];
                    newValue = data.tdm_r
                    break;
                case 'phys':
                    data.phys += args[1];
                    newValue = data.phys
                    break;
                case 'phys_r':
                    data.phys_r += args[1];
                    newValue = data.phys_r
                    break;
                case 'cdm':
                    data.cdm += args[1];
                    newValue = data.cdm
                    break;
                case 'ele':
                    data.ele += args[1];
                    newValue = data.ele
                    break;
                case 'ele_r':
                    data.ele_r += args[1];
                    newValue = data.ele_r
                    break;
                case 'bonus_crit':
                    data.bonus_crit += args[1];
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