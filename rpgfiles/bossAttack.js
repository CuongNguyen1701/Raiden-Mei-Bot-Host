const mongoose = require('mongoose');
const Discord = require('discord.js');
const color = require('../color.json');



//CONNECT TO DATABASE
mongoose.connect(process.env.mongoPass, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database Connected'))
    .catch(err => console.log(err));
//MODELS
const RpgData = require('../models/rpgdata.js');
const Data = require('../models/data.js');

module.exports = {

    execute(message, range) {
        function RandInt(min, max) { return Math.floor(Math.random() * (max - min+1)) + min; }
        function SaveData(data) { data.save().catch(err => console.log(err)); }
        let embed = new Discord.MessageEmbed();


        RpgData.findOne({
            userID: message.author.id,
        }, (err, authorData) => {
            if (!authorData) return;
            RpgData.findOne({
                userID: 1//boss ID
            }, (err, bossData) => {
                if (!bossData) return;//return nothing if there is no boss
                if (bossData.hp == 0) return;//also if boss is dead
                let bossRange = range;
                if ((Math.abs(authorData.posY - bossData.posY) > bossRange) || (Math.abs(authorData.posX - bossData.posX) > bossRange)) {
                    return;// not in range => does not attack
                }
                if (authorData.hp <= 0) return; //does not attack dead player

                let dmg = parseInt(Math.log(bossData.atk) / Math.log(authorData.def) * 150) + RandInt(50, 100);
                let chance = RandInt(1, 100);
                let missRate = 30;
                let critRate = missRate + 20;//the number add with missRate is the crit rate(%)
                if (chance <= missRate) {
                    embed.setColor(color.green);
                    dmg = 0;
                    embed.setDescription('however, ' + bossData.name + ' missed and deal no damage to ' + authorData.name + '!');

                }
                else if (chance <= critRate) {
                    embed.setColor(color.red);
                    dmg = Math.round(dmg*1.5);
                    embed.setDescription('in fact, ' + bossData.name + ' turned on fury mode and deal ' + dmg + ' damage to ' + authorData.name + '!!!');

                }
                else {
                    embed.setColor(color.orange);
                    embed.setDescription(bossData.name + ' deal ' + dmg + ' damage to ' + authorData.name + '!!');
                }
                authorData.hp -= dmg;
                authorData.hp = Math.round(authorData.hp)
                authorData.mp = Math.round(authorData.mp)

                embed.setTitle(bossData.name + ' attack!');
                if (authorData.hp <= 0) {
                    authorData.hp = 0;
                    embed.addField(authorData.name + ' is ded!', ' :skull: :skull: :skull:');

                } else {

                    embed.addField(authorData.name + ':heart: HP:  ', authorData.hp + '/' + authorData.maxHp);
                }
                SaveData(authorData);
                message.channel.send(embed);

            })

        })

    },
};