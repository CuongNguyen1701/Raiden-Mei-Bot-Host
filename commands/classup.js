const Discord = require('discord.js');
const role = require('../roles.json');

const { mongoPass, currency, pCurrency } = require('../config.json');
const mongoose = require('mongoose');


//CONNECT TO DATABASE
mongoose.connect(process.env.mongoPass, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database Connected'))
    .catch(err => console.log(err));
//MODELS
const RpgData = require('../models/rpgdata.js');
const Data = require('../models/data.js');



module.exports = {
    name: 'classup',
    description: 'trả weo để lên class',
    execute(client, message, args) {
        // if(message.author.id != '609937407445434384') return message.reply('you cannot use this command yet!');
        let embed = new Discord.MessageEmbed();


        function RandInt(min, max) { return Math.floor(Math.random() * (max - min)) + min; }

        var user = message.author;
        var cost = 100;

        function SaveData(data) { data.save().catch(err => console.log(err)); }
        function ChangeStats(data, maxHp, maxMp, atk, def) {
            data.class = args[0].toLowerCase();
            data.maxHp = parseInt(data.maxHp * maxHp);
            data.maxMp = parseInt(data.maxMp * maxMp);
            data.atk = parseInt(data.atk * atk);
            data.def = parseInt(data.def * def);
            SaveData(data);
            message.reply('you have successfully become a ' + data.class + '!')
        }
        function CheckMoney(data, value) {
            cost = value;
            if (data.pMoney < cost) return message.reply('you need at least ' + cost + pCurrency);
            data.pMoney -= cost;
            SaveData(data);
        }

        Data.findOne({
            userID: user.id
        }, (err, data) => {
            if (err) console.log(err);
            if (!data) { //check if user has no data on database
                return message.reply('please use ' + prefix + 'create first');
            } else {
                RpgData.findOne({
                    userID: user.id
                }, (err, rpgData) => {
                    if (err) console.log(err);
                    if (!rpgData) {
                        message.reply('please use ' + prefix + 'char command first!');

                    }
                    var firstTier = ['healer', 'archer', 'swordman'];

                    if(!args[0]) return message.reply('please provide the class you wanna upgrade to');
                    upClass = args[0].toLowerCase();

                    switch (rpgData.class) {
                        case 'newbie':
                            switch (upClass) {
                                case firstTier[0]:
                                    CheckMoney(data, 100);
                                    ChangeStats(rpgData, 1.5, 1.3, 1, 1.2)
                                    break;
                                case firstTier[1]:
                                    CheckMoney(data, 100);
                                    ChangeStats(rpgData, 1.1, 1.7, 1.2, 1)
                                    break;
                                case firstTier[2]:
                                    CheckMoney(data, 100);
                                    ChangeStats(rpgData, 1.4, 1, 1.6, 1)
                                    break;
                                default:
                                    message.reply('you can only change your class to ' + firstTier)
                                    break;
                            }
                            break;
                        case 'healer':
                            break;
                        case 'archer':
                            break;
                        case 'swordman':
                            break;
                        default:
                            message.reply('you cannot upgrade your class anymore');
                            break

                    }

                })
            }
        })



    },
};