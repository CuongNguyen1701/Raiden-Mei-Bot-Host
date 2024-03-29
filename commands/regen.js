const mongoose = require('mongoose');
const Discord = require('discord.js');
const ms = require('parse-ms');



//CONNECT TO DATABASE
mongoose.connect(process.env.mongoPass, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(err => console.log(err));

//MODELS
const RpgData = require('../models/rpgdata.js');




module.exports = {
    name: 'regen',
    description: 'hồi mp',
    execute(client, message, args) {



        let embed = new Discord.MessageEmbed();
        function RandInt(min, max) { return Math.floor(Math.random() * (max - min)) + min; }
        function SaveData(data) { data.save().catch(err => console.log(err)); }


        RpgData.findOne({//find author rpg data
            userID: message.author.id
        }, (err, author_rpgData) => {
            if (err) console.log(err);
            if (!author_rpgData) {
                return message.reply('please declare your existence using ' + prefix + 'char first!')
            }
            if (!author_rpgData.lastRecovered) author_rpgData.lastRecovered = 0;
            let restTime = Date.now() - author_rpgData.lastRecovered;
            let mpRecover = Math.floor((restTime / 300000) * (author_rpgData.maxMp / 100)); //1% max mp per 5 min 
            let maxRegen = author_rpgData.maxMp - author_rpgData.mp;
            mpRecover = (mpRecover <= maxRegen) ? mpRecover : maxRegen;
            author_rpgData.mp += mpRecover;
            author_rpgData.lastRecovered = Date.now();



            SaveData(author_rpgData);
            message.reply('you regenerated ' + mpRecover + ' MP. Current :star2: MP:  ' + author_rpgData.mp + '/' + author_rpgData.maxMp)


        })


    },
};