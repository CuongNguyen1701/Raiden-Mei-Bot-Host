const Discord = require('discord.js');
const role = require('../roles.json');

const { mongoPass, currency, pCurrency } = require('../config.json');
const mongoose = require('mongoose');


//CONNECT TO DATABASE
mongoose.connect( process.env.mongoPass, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log( 'Database Connected' ))
.catch(err => console.log( err ));
//MODELS
const RpgData = require('../models/rpgdata.js');
const Data = require('../models/data.js');



module.exports = {
    name: 'lvup',
    description: 'trả weo để lên lv',
    execute(client, message, args) {
       // if(message.author.id != '609937407445434384') return message.reply('you cannot use this command yet!');
       let embed = new Discord.MessageEmbed();
        

        function RandInt(min, max) { return Math.floor(Math.random() * (max - min)) + min;}

            var user = message.author;

        function SaveData(data) { data.save().catch(err => console.log(err)); }

        Data.findOne({
            userID: user.id
        }, (err, data) => {
            if(err) console.log(err);
            if(!data){ //check if user has no data on database
                return message.reply('please use ' + prefix + 'create first');
            } else {
                RpgData.findOne({
                    userID: user.id
                }, (err, rpgData)=>{
                    if(err) console.log(err);
                    if (!rpgData)
                    {
                        message.reply('please use ' + prefix + 'char command first!' ) 
                         
                    }
                    rpgData.lb = 'all';
                    let cost = Math.pow(rpgData.level, 2) * 100;
                    if(data.pMoney < cost) return message.reply('you need at least ' + cost + pCurrency + 'to level up!')
                    data.pMoney -= cost;
                    rpgData.level++;
                    let level = rpgData.level;
                    let multiplier = Math.sin(level)/5 + 1.2;
                    let increment = RandInt(100,150);
                    rpgData.hp = parseInt(rpgData.hp + increment);
                    rpgData.maxHp = parseInt(rpgData.maxHp * multiplier + increment);
                    rpgData.mp = parseInt(rpgData.mp + increment);
                    rpgData.maxMp = parseInt(rpgData.maxMp * multiplier + increment);
                    rpgData.atk = parseInt(rpgData.atk * multiplier + RandInt(10,20));
                    rpgData.def = parseInt(rpgData.def * multiplier + RandInt(15,20));
                    SaveData(data);
                    SaveData(rpgData);


                    message.channel.send(user.username + ' leveled up to level ' + rpgData.level + '! current balance: ' + data.pMoney + pCurrency);
        
        
        
                })
            }
        })



    },
};