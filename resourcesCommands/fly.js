const Discord = require('discord.js');
const role = require('../roles.json');
const ms = require('parse-ms');

const { currency, pCurrency } = require('../config.json');
const mongoose = require('mongoose');


//CONNECT TO DATABASE
mongoose.connect(process.env.mongoPass, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database Connected'))
    .catch(err => console.log(err));
//MODELS
const RpgData = require('../models/rpgdata.js');
const Data = require('../models/data.js');


module.exports = {
    name: 'fly',
    description: 'pay(và pay 200 weo)',
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
            if(args[0] == 'checkpoint' || args[0] == 'cp')
            {
                var id = 2
            }
            else{
                return message.reply('you can only fly to the checkpoint atm!')
            }
            RpgData.findOne({
                userID: id,//checkpoint ID
            }, (err, cpData) => {
                if (!cpData) {
                    return message.reply('error')
                }
                Data.findOne({
                    userID: message.author.id,
                }, (err, moneyData) =>{
                 if(!moneyData) return;
                 let cost = 200;
                 if(moneyData.pMoney < cost) return message.reply('you need at least ' + cost + pCurrency)
                    authorData.posX = cpData.posX;
                    authorData.posY = cpData.posY;
                moneyData.pMoney -= cost;
                SaveData(moneyData);
                SaveData(authorData);
                 

                message.reply('you returned to the checkpoint!');


                })
               


            })





        })

    },
};