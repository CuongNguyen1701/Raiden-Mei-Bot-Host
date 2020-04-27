const Discord = require('discord.js');
const role = require('../roles.json');

const { mongoPass, currency, pCurrency } = require('../config.json');
const mongoose = require('mongoose');


//CONNECT TO DATABASE
mongoose.connect( process.env.mongoPass, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log( 'Database Connected' ))
.catch(err => console.log( err ));
//MODELS
const RpgData = require('../models/rpgdata.js');


module.exports = {
    name: 'char',
    description: 'xem nhân vật rpg của bạn',
    execute(client, message, args) {
       // if(message.author.id != '609937407445434384') return message.reply('you cannot use this command yet!');
       let embed = new Discord.MessageEmbed();
        

        function RandInt(min, max) { return Math.floor(Math.random() * (max - min)) + min;}

        if(!args[0]){
            var user = message.author;
        }else{
            var user = message.mentions.users.first() || client.users.cache.get(args[0]); 
        }

        function SaveData(data) { data.save().catch(err => console.log(err)); }

        RpgData.findOne({
            userID: user.id
        }, (err, rpgData)=>{
            if(err) console.log(err);
            if (!rpgData || !rpgData.hp)
            {
                 var newData = new RpgData({
                    name: client.users.cache.get(user.id).username,
                    userID: user.id,
                    level: 1,
                    class: 'newbie',
                    posX: RandInt(1,10),
                    posY: RandInt(1,10),
                    hp: 100,
                    maxHp: 100,
                    mp: 100, 
                    maxMp: 100,
                    atk: 10,
                    def: 10,

                 })
                 SaveData(newData); 
            }
            let data = newData || rpgData;

            embed.setTitle(client.users.cache.get(user.id).username + "'s stats");
            embed.setThumbnail(user.avatarURL);
            embed.addField('Level: ', data.level, true);0
            embed.addField('Class: ', data.class, true);
            embed.addField('HP: ', data.hp + '/' + data.maxHp);
            embed.addField('MP: ', data.mp + '/' + data.maxMp);
            embed.addField('ATK: ', data.atk, true); 
            embed.addField('DEF: ', data.def, true);
            message.channel.send(embed);



        })

    },
};