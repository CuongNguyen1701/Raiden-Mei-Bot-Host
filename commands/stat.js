const Discord = require('discord.js');
const role = require('../roles.json');

const { mongoPass, currency, pCurrency } = require('../config.json');
const mongoose = require('mongoose');
const createData = require('../triggers/createData');


//CONNECT TO DATABASE
mongoose.connect(process.env.mongoPass, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database Connected'))
    .catch(err => console.log(err));
//MODELS
const data = require('../models/data.js');


module.exports = {
    name: 'stat',
    description: 'xem nhân vật rpg của bạn',
    aliases: ['status', 'char', 'stats', 'properties'],

    execute(client, message, args) {
        // if(message.author.id != '609937407445434384') return message.reply('you cannot use this command yet!');
        let embed = new Discord.MessageEmbed();


        function RandInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

        if (!args[0]) {
            var user = message.author;
        } else if (args[0] == 'boss') {
            var user = new Object();
            user.id = 1;
        }
        else {
            var user = message.mentions.users.first() || client.users.cache.get(args[0]);
        }

        function SaveData(data) { data.save().catch(err => console.log(err)); }

        data.findOne({
            userID: user.id
        }, (err, data) => {
            if (err) console.log(err);
            if (!data) {
                createData.execute(client, user);
            }
            SaveData(data);

            embed.setTitle(`${data.name} 's stats`);
            embed.addField('Level: ', data.level, true);
            embed.addField('Class: ', data.class, true);
            embed.addField(':heart: HP:  ', `${data.stats.hp} / ${data.stats.maxHp}`);
            embed.addField(':star2: MP: ', `${data.stats.mp} / ${data.stats.maxMp}`);
            embed.addField(':crossed_swords: ATK: ', data.stats.atk, true);
            embed.addField(':shield: DEF: ', data.stats.def, true);
            message.channel.send(embed);



        })

    },
};