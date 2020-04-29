
const mongoose = require('mongoose');
const Discord = require('discord.js');



//CONNECT TO DATABASE
mongoose.connect(process.env.mongoPass, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database Connected'))
    .catch(err => console.log(err));

//MODELS
const RpgData = require('../models/rpgdata.js');




module.exports = {
    name: 'heal',
    description: 'hồi máu',
    cooldown: 15,
    execute(client, message, args) {

        if (!args[0]) {
            var user = message.author;
        } else {
            var user = message.mentions.users.first() || client.users.cache.get(args[0]);
        }
        if (!user) return message.reply('cannot find that user!');
        if(user.presence.status != 'online' &&user.presence.status != 'idle') 
		{
			return message.reply('user is not online or idle !');
		}
		if(message.author.presence.status != 'online' && message.author.presence.status != 'online')
		{
			return message.reply('please set your status to online or idle !');
		}
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
            RpgData.findOne({//find user rpg data
                userID: user.id
            }, (err, user_rpgData) => {
                if (err) console.log(err);
                if (!user_rpgData) {
                    return message.reply('user has not enter the map yet!');
                }
                var range = 1;

                switch (author_rpgData.class) {
                    case 'healer': case 'elf': case 'paladin': case 'priest':
                        range++;
                        break;
                    default:
                        break;
                }
                if (author_rpgData.hp <= 0) return message.reply('you are already dead!');
                //both directions' distance is larger than range
                if ((Math.abs(author_rpgData.posY - user_rpgData.posY) > range) || (Math.abs(author_rpgData.posX - user_rpgData.posX) > range)) {
                    return message.reply('user is too far away!');//out of 3x3 square
                }
                //else the player is nearby

                if (author_rpgData.mp < mpCost) return message.reply("you don't have enough MP!");

                let healAmount = Math.ceil((user_rpgData.maxHp * 0.3) + (mpCost * 2)) + RandInt(10, 50);


                switch (author_rpgData.class) {
                    case 'healer': case 'elf': case 'paladin':
                        healAmount = Math.ceil(healAmount * 1.2);
                        break;
                    case 'priest':
                        healAmount = Math.ceil(healAmount * 1.5);
                        break;
                    default:
                        break;
                }
                let mpCost = Math.floor(author_rpgData.maxMp * 0.05) + 50;
                author_rpgData.mp -= mpCost;
                user_rpgData.hp += healAmount;
                if (user_rpgData.hp > user_rpgData.maxHp) user_rpgData.hp = user_rpgData.maxHp;

                embed.setTitle(author_rpgData.name + ' heal!')
                embed.setDescription(user_rpgData.name + ' is healed by ' + healAmount + '!');
                embed.addField(user_rpgData.name + ':heart: HP:  ', user_rpgData.hp + '/' + user_rpgData.maxHp);

                SaveData(user_rpgData);
                SaveData(author_rpgData);
                message.channel.send(embed);


            })
        })

    },
};