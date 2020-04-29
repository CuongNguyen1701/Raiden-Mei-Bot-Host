
const mongoose = require('mongoose');
const Discord = require('discord.js');



//CONNECT TO DATABASE
mongoose.connect(process.env.mongoPass, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database Connected'))
    .catch(err => console.log(err));

//MODELS
const RpgData = require('../models/rpgdata.js');



module.exports = {
    name: 'slash',
    description: 'chém luôn(20 MP)',
    cooldown: 20,
    execute(client, message, args) {
        let user = message.mentions.members.first() || client.users.cache.get(args[0]);
        if (!user) return message.reply('cannot find that user!');
        if (user.id == message.author.id) return message.reply("don't hit yourself please");
        // if(user.presence.status != 'online' &&user.presence.status != 'idle') 
		// {
		// 	return message.reply('user is not online or idle !');
		// }
		// if(message.author.presence.status != 'online' && message.author.presence.status != 'online')
		// {
		// 	return message.reply('please set your status to online or idle !');
		// }
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
                var meleeType = ['swordman', 'paladin', 'knight', 'ranger']
                let range = 1;
                //both directions' distance is larger than 1
                if ((Math.abs(author_rpgData.posY - user_rpgData.posY) > range) || (Math.abs(author_rpgData.posX - user_rpgData.posX) > range)) {
                    return message.reply('user is too far away!');//out of 3x3 square
                }
                //else the player is nearby
                if (author_rpgData.hp <= 0) return message.reply('you are already dead!');
                if (user_rpgData.hp <= 0) return message.reply(user_rpgData.name + ' is already dead!');
                let mpCost = 20;
                if(author_rpgData.mp < mpCost) return message.reply("you don't have enough MP!");
                let dmg = parseInt(Math.log(author_rpgData.atk) / Math.log(user_rpgData.def) * 75) + RandInt(1, 10);
                let crit = false;
                function CritRate(critRate) {
                    let chance = RandInt(1, 100);
                    if (chance <= critRate) dmg *= 2;
                    crit =true;

                }



                switch (author_rpgData.class) {
                    case meleeType[2]:
                        dmg *= 3;
                        CritRate(60)
                        break;
                    case meleeType[0]: case meleeType[1]: case meleeType[3]:
                        dmg *= 2;
                        CritRate(50);
                        break;
                }


                if(crit) embed.setTitle( 'CRIT!! ' + author_rpgData.name + ' attack!');
                else embed.setTitle(author_rpgData.name + ' attack!');
                user_rpgData.hp -= dmg;
                author_rpgData.mp -= mpCost;

                
                embed.setDescription(author_rpgData.name + ' deal ' + dmg + ' damage to ' + user_rpgData.name + '!')
                if (user_rpgData.hp <= 0) {
                    user_rpgData.hp = 0;
                    embed.addField(user_rpgData.name + ' is ded!', ' :skull: :skull: :skull:');

                } else {

                    embed.addField(user_rpgData.name + ':heart: HP:  ', user_rpgData.hp + '/' + user_rpgData.maxHp);
                }
                SaveData(user_rpgData);
				SaveData(author_rpgData);

                message.channel.send(embed);


            })
        })

    },
};