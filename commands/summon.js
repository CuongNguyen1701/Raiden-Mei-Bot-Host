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


module.exports = {
    name: 'summon',
    description: 'triệu hồi boss',
    cooldown: 36000,
    execute(client, message, args) {
       // if(message.author.id != '609937407445434384') return message.reply('you cannot use this command yet!');
       let embed = new Discord.MessageEmbed();
        

        function RandInt(min, max) { return Math.floor(Math.random() * (max - min)) + min;}

 
        function SaveData(data) { data.save().catch(err => console.log(err)); }

        RpgData.findOne({
            userID: message.author.id
        }, (err, authorData)=>{
            if(err) console.log(err);
            if (!authorData)
            {
				return message.reply('please declare your existence using ' + prefix + 'char first!');
            }
            var id = 1 
            RpgData.findOne({
                userID: id,//boss ID
            }, (err, bossData) => {
                if(!bossData)
                {
                    var newData = new RpgData({
                        name: 'BOSS',
                        userID: id,
                        level: authorData.level,
                        lb: 'boss',
                        class: 'boss',
                        posX: RandInt(1,10),
                        posY: RandInt(1,10),
                        hp: authorData.hp*10,
                        maxHp: authorData.hp*10,
                        atk: authorData.atk,
                        def: authorData.def/2,
                    })
                    SaveData(newData);
                }
                else{
                    if(bossData.hp > 0) return message.reply('current boss has not dead yet!');
                    bossData.level = authorData.level,
                    bossData.posX =  RandInt(1,10);
                    bossData.posY = RandInt(1, 10);
                    bossData.hp = authorData.maxHp*10,
                    bossData.maxHp = authorData.maxHp*10,
                    bossData.atk = authorData.atk,
                    bossData.def = authorData.def/2,
                    SaveData(bossData);
                }
                let data = newData || bossData;
                message.reply('you have successfully summoned a level ' + data.level + ' boss!');
            
            
            
            })
            
           



        })

    },
};