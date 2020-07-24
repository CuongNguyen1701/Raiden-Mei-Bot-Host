const Discord = require('discord.js');
const role = require('../roles.json');
const ms = require('parse-ms');

const { currency, pCurrency } = require('../config.json');
const mongoose = require('mongoose');
const color = require('../color.json');


//CONNECT TO DATABASE
mongoose.connect(process.env.mongoPass, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(err => console.log(err));
//MODELS
const RpgData = require('../models/rpgdata.js');
const Data = require('../models/data.js');


module.exports = {
    name: 'detect',
    description: 'dò kho báu ẩn',
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
            var id = 4;
            RpgData.findOne({
                userID: id,
            }, (err, chestData) => {
                if (!chestData) {
                    var newData = new RpgData({
                        name: 'HIDDEN TREASURE CHEST',
                        userID: id,
                        level: 100000,
                        lb: 'treasure chest',
                        class: 'hidden chest',
                        posX: RandInt(1, 10),
                        posY: RandInt(1, 10),
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
                    //both directions' distance is larger than range
                    if ((Math.abs(authorData.posY - chestData.posY) > range) || (Math.abs(authorData.posX - chestData.posX) > range)) {
                        let distanceY = Math.abs(authorData.posY - chestData.posY);
                        let distanceX = Math.abs(authorData.posX - chestData.posX);

                        let distanceTotal = distanceX + distanceY;
                        return message.reply(`you are ${distanceTotal} squares away from the hidden treasure!`)

                    }

                    if (authorData.hp == 0) return message.reply('you are already dead!');
                    if (!authorData.lastCollectedHidden) authorData.lastCollectedHidden = 0;
                    if (timeout - (Date.now() - authorData.lastCollectedHidden) > 0) {
                        let time = ms(timeout - (Date.now() - authorData.lastCollectedHidden));//parse ms to time object
                        embed.setColor(color.red);
                        embed.setDescription('you cannot collect the hidden treasure yet!');
                        embed.addField('collect again in: ', time.hours + 'h' + time.minutes + 'm' + time.seconds + 's');
                        return message.channel.send(embed);

                    }
                    authorData.lastCollectedHidden = Date.now();//set individual cd
                    let reward = RandInt(700, 1000);
                    moneyData.pMoney += reward;
                    chestData.posX = RandInt(1, 10);//refresh new location everytime someone collect
                    chestData.posY = RandInt(1, 10);//
                    SaveData(authorData);
                    SaveData(moneyData);
                    SaveData(chestData);

                    embed.setColor(color.green);
                    embed.setTitle('HIDDEN TREASURE!!')
                    embed.setDescription(authorData.name + ' collected :moneybag: :moneybag: :moneybag: ' + reward + pCurrency + '!')

                    message.channel.send(embed);



                })
            })

        })

    },
};