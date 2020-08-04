const mongoose = require('mongoose');
const Discord = require('discord.js');
const color = require('../color.json');



//CONNECT TO DATABASE
mongoose.connect(process.env.mongoPass, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(err => console.log(err));

//MODELS
const Data = require('../models/luckynumdata.js');

module.exports = {
    name: 'check',
    description: 'check số chưa được đoán',
    execute(client, message, args) {



        Data.find({
            checkable: true
        }).sort([
            ['guess', 'descending']
        ]).exec((err, res) => {
            if (err) console.log(err);
            if (!res) return message.reply(`there's no guess yet`);
            let msg = `guessed numbers: `
            for (i = 0; i < res.length; i++) {
                if (i % 5 == 0) {
                    msg += `\n ${res[i].guess}`
                } else {
                    msg += `  ${res[i].guess}`
                }
            }
            message.channel.send(msg);
        })







    },
};