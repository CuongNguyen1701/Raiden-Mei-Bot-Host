
const mongoose = require('mongoose');
const Discord = require('discord.js');

const bossAttack = require('../rpgfiles/bossAttack');
const lootBoss = require('../rpgfiles/lootBoss');




//CONNECT TO DATABASE
mongoose.connect(process.env.mongoPass, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database Connected'))
    .catch(err => console.log(err));

//MODELS
const RpgData = require('../models/rpgdata.js');



module.exports = {
    name: 'stealthshot',
    description: '[sniper+]bắn tầm xa, có khả năng không bị quái đánh (75 MP)',
    cooldown: 40,
    execute(client, message, args) {
        if (args[0] == 'boss' || !args[0]) {
            var user = new Object();
            user.id = 1;
        }
        else {
            var user = message.mentions.users.first() || client.users.cache.get(args[0]);
        }
        if (!user) return message.reply('cannot find that user!');
        if (user.id == message.author.id) return message.reply("don't hit yourself please");

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
                var sniperType = ['sniper', 'commander', 'cyborg'];
                if (!sniperType.includes(author_rpgData.class)) {
                    return message.reply("This is an exclusive move of " + sniperType + "!");
                }
                let range = 3;
                let mpCost = 75;


                //both directions' distance is larger than 1
                if ((Math.abs(author_rpgData.posY - user_rpgData.posY) > range) || (Math.abs(author_rpgData.posX - user_rpgData.posX) > range)) {
                    return message.reply('user is too far away!');//out of 3x3 square
                }
                //else the player is nearby
                if (author_rpgData.hp <= 0) return message.reply('you are already dead!');
                if (user_rpgData.hp <= 0) return message.reply(user_rpgData.name + ' is already dead!');

                let dmg = parseInt(Math.log(author_rpgData.atk) / Math.log(user_rpgData.def) * 100) + RandInt(50, 100);
                if (author_rpgData.mp < mpCost) return message.reply("you don't have enough MP!");

                let stealth = false;
                function StealthRate(rate){
                    let chance = RandInt(1, 100);
                    if (chance <= rate) stealth = true;
                }
                author_rpgData.mp -= mpCost;
                user_rpgData.hp -= dmg;

                embed.setTitle(author_rpgData.name + ' stealth shot attack!');
                embed.setDescription(author_rpgData.name + ' deal ' + dmg + ' damage to ' + user_rpgData.name + '!')
                if (user_rpgData.hp <= 0) {
                    user_rpgData.hp = 0;
                    embed.addField(user_rpgData.name + ' is ded!', ' :skull: :skull: :skull:');

                } else {

                    embed.addField(user_rpgData.name + ':heart: HP:  ', user_rpgData.hp + '/' + user_rpgData.maxHp);
                }
                SaveData(user_rpgData);
                SaveData(author_rpgData);
                if (user.id == 1) {//if user attack the boss
                    lootBoss.execute(message, dmg);
                }
                message.channel.send(embed);
                StealthRate(30);
                if(stealth) return;//if user stealth successfully, boss wont attack
                bossAttack.execute(message, range);


            })
        })

    },
};