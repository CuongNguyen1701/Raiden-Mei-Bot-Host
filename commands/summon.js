const Discord = require('discord.js');
const role = require('../roles.json');
const ms = require('parse-ms');

const { mongoPass, currency, pCurrency } = require('../config.json');
const mongoose = require('mongoose');


//CONNECT TO DATABASE
mongoose.connect(process.env.mongoPass, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database Connected'))
    .catch(err => console.log(err));
//MODELS
const RpgData = require('../models/rpgdata.js');


module.exports = {
    name: 'summon',
    description: 'triệu hồi boss',
    execute(client, message, args) {
        // if(message.author.id != '609937407445434384') return message.reply('you cannot use this command yet!');
        let embed = new Discord.MessageEmbed();

        let timeout = 7200000;
        function RandInt(min, max) { return Math.floor(Math.random() * (max - min)) + min; }


        function SaveData(data) { data.save().catch(err => console.log(err)); }

        RpgData.findOne({
            userID: message.author.id
        }, (err, authorData) => {
            if (err) console.log(err);
            if (!authorData) {
                return message.reply('please declare your existence using ' + prefix + 'char first!');
            }
            var id = 1
            RpgData.findOne({
                userID: id,//boss ID
            }, (err, bossData) => {
                if (!bossData) {
                    var newData = new RpgData({
                        name: 'BOSS',
                        userID: id,
                        level: authorData.level,
                        lb: 'boss',
                        class: 'boss',
                        posX: RandInt(4, 10),
                        posY: RandInt(4, 10),
                        hp: authorData.maxHp * 10,
                        maxHp: authorData.maxHp * 10,
                        atk: authorData.atk,
                        def: authorData.def / 2,
                        dateSummoned: Date.now(),

                    })
                    SaveData(newData);
                }
                else {
                    if (bossData.hp > 0) return message.reply('current boss has not dead yet!');
                    if (timeout - (Date.now() - bossData.dateSummoned > 0)) {
                        let time = ms(timeout - (Date.now() - bossData.dateSummoned))
                        embed.setColor('ff0000');
                        embed.setDescription('the boss summon is under cooldowns!');
                        embed.addField('able to summon in: ', time.hours + 'h' + time.minutes + 'm' + time.seconds + 's');
                        return message.channel.send(embed);
                    }
                    bossData.level = authorData.level,
                        bossData.posX = RandInt(4, 10);
                    bossData.posY = RandInt(4, 10);
                    bossData.hp = authorData.maxHp * 10,
                        bossData.maxHp = authorData.maxHp * 10,
                        bossData.atk = authorData.atk,
                        bossData.def = authorData.def / 2,
                        bossData.dateSummoned = Date.now();
                    SaveData(bossData);
                }
                let data = newData || bossData;
                message.reply('you have successfully summoned a level ' + data.level + ' boss!');



            })





        })

    },
};