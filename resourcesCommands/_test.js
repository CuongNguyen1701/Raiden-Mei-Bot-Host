const Discord = require('discord.js');
const role = require('../roles.json');

const { mongoPass, currency, pCurrency } = require('../config.json');
const mongoose = require('mongoose');


//CONNECT TO DATABASE
mongoose.connect(process.env.mongoPass, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database Connected'))
    .catch(err => console.log(err));
//MODELS
const RpgData = require('../models/rpgdata.js');


module.exports = {
    name: 'test',
    description: 'test',
    aliases: ['t'],

    execute(client, message, args) {
        if (message.author.id != '609937407445434384') return message.reply('you cannot use this command yet!');
        let embed = new Discord.MessageEmbed();


        function RandInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

        var property;
        var user = message.author;
        if (!args[0]) {
            property = 1;
        }
        else {
            property = args[0]
        }

        function SaveData(data) { data.save().catch(err => console.log(err)); }

        RpgData.findOne({
            userID: user.id
        }, (err, rpgData) => {
            if (err) console.log(err);
            rpgData.testObject = { prp1, prp2, prp3 };
            rpgData.testObject.prp1 = property;
            rpgData.testObject.prp2 = 2 + property;
            rpgData.testObject.prp3 = 3 + property;
            SaveData(rpgData);
            if (!args[1]) args[1] = 1;
            switch (args[1]) {
                case 1:
                    message.channel.send(prp1);
                    break;

                case 2:
                    message.channel.send(prp2);
                    break;

                case 3:
                    message.channel.send(prp3);
                    break;

            }








        })

    },
};