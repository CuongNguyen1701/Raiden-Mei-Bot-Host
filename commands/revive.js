const mongoose = require('mongoose');
const Discord = require('discord.js');



//CONNECT TO DATABASE
mongoose.connect(process.env.mongoPass, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database Connected'))
    .catch(err => console.log(err));

//MODELS
const RpgData = require('../models/rpgdata.js');




module.exports = {
    name: 'revive',
    description: 'hồi sinh',
    cooldown: 3600,
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

                author_rpgData.mp = author_rpgData.maxMp;
                author_rpgData.hp = author_rpgData.maxHp;
        

                embed.setTitle(author_rpgData.name + ' revived!')
                embed.setDescription(author_rpgData.name + ' is fully recovered!');
                embed.addField(author_rpgData.name + ':heart: HP:  ', author_rpgData.hp + '/' + author_rpgData.maxHp);
                embed.addField(author_rpgData.name + ':star2: MP:  ', author_rpgData.mp + '/' + author_rpgData.maxMp);


                SaveData(author_rpgData);
                message.channel.send(embed);


        })    
        

    },
};