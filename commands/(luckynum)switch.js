
const { mongoPass } = require('../config.json');
const role = require('../roles.json');
const mongoose = require('mongoose');

//CONNECT TO DATABASE
mongoose.connect(process.env.mongoPass, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(err => console.log(err));

//MODELS
const Data = require('../models/luckynumdata.js');
const cooldown = require('../models/cooldowns.js');

module.exports = {
    name: 'switch',
    description: 'bật/tắt chức năng đoán',
    execute(client, message, args) {
        if (message.author.id != '609937407445434384') return message.reply('you cannot use this command yet!');

        function SaveData(data) { data.save().catch(err => console.log(err)); }

        cooldown.findOne({ id: 1 }), (err, data) => {
            if (err) console.log(err);
            if (!data) {
                var newData = new cooldown({
                    id: 1,
                    guessDisabled: false
                })
                SaveData(newData);
            }
            data.guessDisabled = !data.guessDisabled || newData;
            SaveData(data);
            if (data.guessDisabled) return message.reply('you disabled the guessing function!');
            return message.reply(`you enabled the guessing function!`);
        }







    },
};