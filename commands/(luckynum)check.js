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

        var max = 57;
        var guessPool = new Array(max)
        for (var i = 0; i < max; i++) {
            guessPool[i] = (i + 1);
        }

        Data.find({}).sort([
            ['guess', 'descending']
        ]).exec((err, res) => {
            if (err) console.log(err);
            if (res.length = 0) return message.reply(`there's no guess yet`);
            console.log(res);
            let msg = 'available numbers: '
            var available = guessPool;
            for (j = 0; j < res.length; j++) {
                available = available.filter(availNum => availNum != res[j].guess)

            }

            for (i = 0; i < available.length; i++) {
                if ((i % 10) == 0) msg += `\n ${available[i]}`

                else msg += `    ${available[i]}`
            }

            message.channel.send(msg);
        })







    },
};