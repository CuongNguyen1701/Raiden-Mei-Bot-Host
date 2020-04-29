const mongoose = require('mongoose');
const Discord = require('discord.js');


//CONNECT TO DATABASE
mongoose.connect(process.env.mongoPass, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database Connected'))
    .catch(err => console.log(err));
//MODELS
const RpgData = require('../models/rpgdata.js');
const Data = require('../models/data.js');

module.exports = {

    execute(message) {
        function RandInt(min, max) { return Math.floor(Math.random() * (max - min)) + min;}
        function SaveData(data) { data.save().catch(err => console.log(err)); }
		let embed = new Discord.MessageEmbed();


            RpgData.findOne({
                userID = message.author.id,
            },(err, authorData) => { 
                if(!authorData) return;
                RpgData.findOne({
                    userID = 1,//boss ID
                }, (err, bossData) => {
                    if(!bossData) return;//return nothing if there is no boss
                    if(bossData.hp == 0) return;//also if boss is dead
                     let range = 3;
                     if ((Math.abs(authorData.posY - bossData.posY) > range) || (Math.abs(authorData.posX - bossData.posX) > range)) {
                        return;// not in range => does not attack
                    }
                    if(authorData.hp <= 0) return; //does not attack dead player

                    let dmg = parseInt(Math.log(bossData.atk)/Math.log(authorData.def) * 150) + RandInt(50, 100);
                    authorData.hp -= dmg;
                    embed.setTitle(bossData.name + ' attack!')
                    embed.setDescription(bossData.name + ' deal ' + dmg + ' damage to ' + authorData.name + '!')
                    if(authorData.hp <= 0) 
                    {
                        authorData.hp = 0;
                        embed.addField(authorData.name + ' is ded!', ' :skull: :skull: :skull:');
                        
                    }else{
    
                        embed.addField(authorData.name + ':heart: HP:  ', authorData.hp + '/' + authorData.maxHp);
                    }
                    SaveData(authorData);
                    message.channel.send(embed);

                })

            })

    },
};