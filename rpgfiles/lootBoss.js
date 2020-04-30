const mongoose = require('mongoose');
const Discord = require('discord.js');
const color = require('../color.json');

const { pCurrency} = require('../config.json');


//CONNECT TO DATABASE
mongoose.connect(process.env.mongoPass, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database Connected'))
    .catch(err => console.log(err));
//MODELS
const RpgData = require('../models/rpgdata.js');
const Data = require('../models/data.js');

module.exports = {

    execute(message, dmg) {
        function RandInt(min, max) { return Math.floor(Math.random() * (max - min+1)) + min; }
        function SaveData(data) { data.save().catch(err => console.log(err)); }
        var reward = 0;


        RpgData.findOne({
            userID: message.author.id,
        }, (err, authorData) => {
            if (!authorData) return;
            RpgData.findOne({
                userID: 1//boss ID
            }, (err, bossData) => {
                if (!bossData) return;//return nothing if there is no boss
                if (bossData.hp == 0) {//if boss dead
                    if(bossData.level >= authorData.level - 3){
                        reward = bossData.level*100; 
                    }
                    else{
                        reward = Math.round(bossData.level*100/(authorData.level - bossData.level));
                    }
                };
                reward += Math.round(dmg/10 + RandInt(1, bossData.level * 5 ));
                Data.findOne({
                    userID: message.author.id,
                }, (err, moneyData) =>{

                    if(!moneyData) return;
                    moneyData.pMoney += reward;
                    SaveData(moneyData);
                    message.channel.send(":moneybag: :moneybag: :moneybag: " +moneyData.id + ' received: ' , reward + pCurrency + '!');

                })

                
            })

        })

    },
};