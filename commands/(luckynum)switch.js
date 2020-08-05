
const { mongoPass } = require('../config.json');
const role = require('../roles.json');
const mongoose = require('mongoose');

//CONNECT TO DATABASE
mongoose.connect(process.env.mongoPass, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(err => console.log(err));

//MODELS
const cooldown = require('../models/cooldowns.js');

module.exports = {
    name: 'switch',
    description: 'bật/tắt chức năng đoán',
    execute(client, message, args) {
        if (message.author.id != '609937407445434384') return message.reply('you cannot use this command yet!');
        console.log(`on`)
        function SaveData(data) { data.save().catch(err => console.log(err)); }

        cooldown.findOne({
            id: 1
        }, (err, switchData) => {
            if (err) console.log(err);
            if (!switchData) {
                var newData = new cooldown({
                    id: 1,
                    guessDisabled: true
                })
                SaveData(newData);
            }
            data = newData || switchData;
            data.guessDisabled = !data.guessDisabled;
            SaveData(data);
            if (data.guessDisabled) return message.reply('you disabled the guessing function!');
            return message.reply(`you enabled the guessing function!`);
        })







    },
};