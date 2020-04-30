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
    name: 'checkpoint',
    description: 'điểm hồi HP và MP',
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
            var id = 2
            RpgData.findOne({
                userID: id,//checkpoint ID
            }, (err, cpData) => {
                if (!cpData) {
                    var newData = new RpgData({
                        name: 'CHECK POINT',
                        userID: id,
                        level: 100000,
                        lb: 'checkpoint',
                        class: 'checkpoint',
                        posX: 2,
                        posY: 2,
                        hp: 0,
                        maxHp: 0,
                        atk: 0,
                        def: 0,
                        dateSummoned: Date.now(),

                    })
                    SaveData(newData);
                }
                Data.findOne({
                    userID: message.author.id,
                }, (err, moneyData) =>{
                 if(!moneyData) return;
                    let range = 1;
                    let cost = 100;
				//both directions' distance is larger than 1
				if ((Math.abs(authorData.posY - cpData.posY) > range) || (Math.abs(authorData.posX - cpData.posX) > range)) {
					return message.reply('the checkpoint is too far away!');//out of 3x3 square
                }
                if(moneyData.pMoney < cost) return message.reply('you need at least ' + cost + pCurrency + ' to activate the checkpoint!')
                 moneyData.pMoney -= cost;
                 authorData.hp += (1/10)*(authorData.maxHp);
                 authorData.mp += (1/10)*(authorData.maxMp);
                 if(authorData.hp > authorData.maxHp) authorData.hp = authorData.maxHp;
                 if(authorData.mp > authorData.maxMp) authorData.mp = authorData.maxMp;
                 SaveData(moneyData);
                 SaveData(authorData);



                })
               


            })





        })

    },
};