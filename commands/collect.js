const Discord = require('discord.js');
const role = require('../roles.json');
const ms = require('parse-ms');

const { currency, pCurrency } = require('../config.json');
const mongoose = require('mongoose');
const color = require('../color.json');


//CONNECT TO DATABASE
mongoose.connect(process.env.mongoPass, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database Connected'))
    .catch(err => console.log(err));
//MODELS
const RpgData = require('../models/rpgdata.js');
const Data = require('../models/data.js');


module.exports = {
    name: 'collect',
    description: 'nhặt tiền trong rương',
    cooldown: 30,
    execute(client, message, args) {
        // if(message.author.id != '609937407445434384') return message.reply('you cannot use this command yet!');
        let embed = new Discord.MessageEmbed();

        function RandInt(min, max) { return Math.floor(Math.random() * (max - min)) + min; }


        function SaveData(data) { data.save().catch(err => console.log(err)); }

        RpgData.findOne({
            userID: message.author.id
        }, (err, authorData) => {
            if (err) console.log(err);
            if (!authorData) {
                return message.reply('please declare your existence using ' + prefix + 'char first!');
            }
            var id = 3
            RpgData.findOne({
                userID: id,//checkpoint ID
            }, (err, chestData) => {
                if (!chestData) {
                    var newData = new RpgData({
                        name: 'TREASURE CHEST',
                        userID: id,
                        level: 100000,
                        lb: 'treasure chest',
                        class: 'chest',
                        posX: 8,
                        posY: 8,
                        hp: 0,
                        maxHp: 0,
                        atk: 0,
                        def: 0,
                        dateSummoned: Date.now(),

                    })
                    SaveData(newData);
                    return;
                }
                Data.findOne({
                    userID: message.author.id,
                }, (err, moneyData) => {
                    if (!moneyData) return;
                    let range = 0;
                    let timeout = 7200000;
                    let cost = 100;
                    //both directions' distance is larger than range
                    if ((Math.abs(authorData.posY - chestData.posY) > range) || (Math.abs(authorData.posX - chestData.posX) > range)) {
                        return message.reply('the treasure is not in range, you must be in the same position as the treasure!');//out of 3x3 square
                    }
                    if(authorData.hp = 0) return message.reply('you are already dead!');
                    if(!authorData.lastCollected) authorData.lastCollected = 0;
                    if (timeout - (Date.now() - authorData.lastCollected) > 0) {
                        let time = ms(timeout - (Date.now() - authorData.lastCollected));
                        embed.setColor(color.red);
                        embed.setDescription('you cannot collect the treasure yet!');
                        embed.addField('collect again in: ', time.hours + 'h' + time.minutes + 'm' + time.seconds + 's');
                        return message.channel.send(embed);

                    }
                    authorData.lastCollected = Date.now();
                    let reward = RandInt(200, 500);
                    moneyData.pMoney += reward;
                    chestData.posX = RandInt(1, 10);
                    chestData.posY = RandInt(1, 10);
                    SaveData(authorData);
                    SaveData(moneyData);
                    SaveData(chestData);
                    embed.setColor(color.green);
                    embed.setDescription(authorData.name + ' collected :moneybag: :moneybag: :moneybag: ' + reward +pCurrency + '!')


                    message.channel.send(embed); 



                })



            })





        })

    },
};