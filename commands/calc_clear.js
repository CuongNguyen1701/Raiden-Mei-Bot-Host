
const mongoose = require('mongoose');


//CONNECT TO DATABASE
mongoose.connect(process.env.mongoPass, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(err => console.log(err));

//MODELS
const CalcData = require('../models/calcdata.js');


module.exports = {
    name: 'clear',
    description: 'clear the calculator',
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
            data.lv = 80;
            data.atk = 1000;
            data.crt = 100;
            data.tdm = 0;
            data.tdm_r = 0;
            data.phys = 0;
            data.phys_r = 0;
            data.cdm = 0;
            data.ele = 0;
            data.ele_r = 0;
            data.bonus_crit = 0;


            SaveData(data);
            message.channel.send(`calculator has been set to default!`);

        })
    }

}