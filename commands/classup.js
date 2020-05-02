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
        var cost;

        var firstTier = ['healer', 'archer', 'swordman'];

        var secondTier = ['elf', 'priest', 'paladin', 'knight', 'ranger', 'sniper'];

        var elfTier = ['darkelf', 'avariel'];
        var priestTier = ['cleric', 'exorcist'];
        var paladinTier = ['valkyrie', 'crusader'];
        var knightTier = ['gladiator', 'samurai']
        var rangerTier = ['ninja', 'vampire']
        var sniperTier = ['commander', 'cyborg']

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
        function CheckMoney(data, value) {//if author has enough money
            cost = value;
            if (data.pMoney < cost) return message.reply('you need at least ' + cost + pCurrency);
            data.pMoney -= cost;
            cost = 0;
            SaveData(data);
        }
        Array.prototype.subArray = function (start, end) {
            if (!end) { end = -1; }
            return this.slice(start, this.length + 1 - (end * -1));
        };

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

                    upClass = args[0].toLowerCase() || 'unknown';

                    switch (rpgData.class) {
                        case 'newbie':
                            switch (upClass) {
                                case firstTier[0]:
                                    CheckMoney(data, 100);
                                    if (data.pMoney < cost) return;
                                    ChangeStats(rpgData, 1.5, 1.3, 1, 1.2);
                                    break;
                                case firstTier[1]:
                                    CheckMoney(data, 100);
                                    if (data.pMoney < cost) return;
                                    ChangeStats(rpgData, 1.1, 1.7, 1.2, 1);
                                    break;
                                case firstTier[2]:
                                    CheckMoney(data, 100);
                                    if (data.pMoney < cost) return;
                                    ChangeStats(rpgData, 1.4, 1, 1.6, 1);
                                    break;
                                default:
                                    message.reply('you can only change your class to ' + firstTier)
                                    break;
                            }
                            break;
                        case 'healer':
                            switch (upClass) {
                                case secondTier[0]:
                                    CheckMoney(data, 1000);
                                    if (data.pMoney < cost) return;
                                    ChangeStats(rpgData, 1, 1.6, 1.3, 1.1);
                                    break;
                                case secondTier[1]:
                                    CheckMoney(data, 1000);
                                    if (data.pMoney < cost) return;
                                    ChangeStats(rpgData, 1.2, 1.7, 1, 1.1);
                                    break;
                                case secondTier[2]:
                                    CheckMoney(data, 1000);
                                    if (data.pMoney < cost) return;
                                    ChangeStats(rpgData, 1.2, 1, 1.3, 1.5);
                                    break;
                                default:
                                    message.reply('you can only change your class to ' + secondTier.subArray(0, -4))
                                    break;
                            }
                            break;
                        case 'swordman':
                            switch (upClass) {
                                case secondTier[2]:
                                    CheckMoney(data, 1000);
                                    if (data.pMoney < cost) return;
                                    ChangeStats(rpgData, 1.2, 1, 1.3, 1.5);
                                    break;
                                case secondTier[3]:
                                    CheckMoney(data, 1000);
                                    if (data.pMoney < cost) return;
                                    ChangeStats(rpgData, 1.3, 1, 1.1, 1.6);
                                    break;
                                case secondTier[4]:
                                    CheckMoney(data, 1000);
                                    if (data.pMoney < cost) return;
                                    ChangeStats(rpgData, 1, 1.3, 1.6, 1.1);
                                    break;
                                default:
                                    message.reply('you can only change your class to ' + secondTier.subArray(2, -2))
                                    break;
                            }
                            break;
                        case 'archer':
                            switch (upClass) {
                                case secondTier[4]:
                                    CheckMoney(data, 1000);
                                    if (data.pMoney < cost) return;
                                    ChangeStats(rpgData, 1, 1.3, 1.6, 1.1);
                                    break;
                                case secondTier[5]:
                                    CheckMoney(data, 1000);
                                    if (data.pMoney < cost) return;
                                    ChangeStats(rpgData, 1.1, 1.2, 1.7, 1);
                                    break;
                                case secondTier[0]:
                                    CheckMoney(data, 1000);
                                    if (data.pMoney < cost) return;
                                    ChangeStats(rpgData, 1, 1.6, 1.3, 1.1);
                                    break;
                                default:
                                    message.reply('you can only change your class to ' + secondTier.subArray(4) + ',' + secondTier[0])
                                    break;
                            }
                            break;
                        case 'elf':
                            switch (upClass) {
                                case elfTier[0]:
                                    CheckMoney(data, 10000);
                                    if (data.pMoney < cost) return;
                                    ChangeStats(rpgData, 1, 1.5, 2, 1.5);
                                    break;
                                case elfTier[1]:
                                    CheckMoney(data, 10000);
                                    if (data.pMoney < cost) return;
                                    ChangeStats(rpgData, 1.4, 2, 1.3, 1.3);
                                    break;
                                default:
                                    message.reply('you can only change your class to ' + elfTier)
                                    break;
                            }
                            break;
                        case 'priest':
                            switch (upClass) {
                                case priestTier[0]:
                                    CheckMoney(data, 10000);
                                    if (data.pMoney < cost) return;
                                    ChangeStats(rpgData, 1.3, 1.7, 1, 2);
                                    break;
                                case priestTier[1]:
                                    CheckMoney(data, 10000);
                                    if (data.pMoney < cost) return;
                                    ChangeStats(rpgData, 1, 1.7, 2, 1.3);
                                    break;
                                default:
                                    message.reply('you can only change your class to ' + priestTier)
                                    break;
                            }
                            break;
                        case 'paladin':
                            switch (upClass) {
                                case paladinTier[0]:
                                    CheckMoney(data, 10000);
                                    if (data.pMoney < cost) return;
                                    ChangeStats(rpgData, 1.5, 1.5, 2, 1);
                                    break;
                                case paladinTier[1]:
                                    CheckMoney(data, 10000);
                                    if (data.pMoney < cost) return;
                                    ChangeStats(rpgData, 2, 1, 1.5, 1.5);
                                    break;
                                default:
                                    message.reply('you can only change your class to ' + paladinTier)
                                    break;
                            }
                            break;
                        case 'knight':
                            switch (upClass) {
                                case knightTier[0]:
                                    CheckMoney(data, 10000);
                                    if (data.pMoney < cost) return;
                                    ChangeStats(rpgData, 2, 1, 2, 1);
                                    break;
                                case knightTier[1]:
                                    CheckMoney(data, 10000);
                                    if (data.pMoney < cost) return;
                                    ChangeStats(rpgData, 1, 1, 2, 2);
                                    break;
                                default:
                                    message.reply('you can only change your class to ' + knightTier)
                                    break;
                            }
                            break;
                        case 'ranger':
                            switch (upClass) {
                                case rangerTier[0]:
                                    CheckMoney(data, 10000);
                                    if (data.pMoney < cost) return;
                                    ChangeStats(rpgData, 1.2, 1.5, 2.3, 1);
                                    break;
                                case rangerTier[1]:
                                    CheckMoney(data, 10000);
                                    if (data.pMoney < cost) return;
                                    ChangeStats(rpgData, 1.3, 2, 1.5, 1.2);
                                    break;
                                default:
                                    message.reply('you can only change your class to ' + rangerTier)
                                    break;
                            }
                            break;
                        case 'sniper':
                            switch (upClass) {
                                case sniperTier[0]:
                                    CheckMoney(data, 10000);
                                    if (data.pMoney < cost) return;
                                    ChangeStats(rpgData, 2, 1, 1, 2);
                                    break;
                                case sniperTier[1]:
                                    CheckMoney(data, 10000);
                                    if (data.pMoney < cost) return;
                                    ChangeStats(rpgData, 1, 1, 1.7, 2.3);
                                    break;
                                default:
                                    message.reply('you can only change your class to ' + sniperTier)
                                    break;
                            }
                            break;


                        default:
                            message.reply('you cannot upgrade your class anymore');
                            break;

                    }

                })
            }
        })



    },
};