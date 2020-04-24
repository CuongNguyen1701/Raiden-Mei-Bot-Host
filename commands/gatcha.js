const Discord = require('discord.js');

const {currency, mongoPass} = require('../config.json');
const role = require('../roles.json');

const mongoose = require('mongoose');


//CONNECT TO DATABASE
mongoose.connect( process.env.mongoPass, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log( 'Database Connected' ))
.catch(err => console.log( err ));
//MODELS
const Data = require('../models/data.js');



module.exports = {
	name: 'gatcha',
    description: 'tiêu 100' + currency + ' đổi thưởng',
    cooldown: 10,
	execute(client, message, args) {
        Data.findOne({
            userID: message.author.id
        }, (err, data) => {
            if(err) console.log(err);
            if(!data){ //check if user has no data on database
            return message.reply('please use ' + prefix + 'create first');
            }
            else
            {
                if(data.money <= 0) return message.reply('you have no money!');
                let embed = new Discord.MessageEmbed;
                var gatchaPrice = 100;
                
                if(data.money < gatchaPrice) return message.reply('you do not have enough money, you need at least ' + gatchaPrice + currency);
                let gatchaPool = ["Mei's birthday cake", "Mei's underwears", "Mei's emblem", "Mei's bentou", "Mei's MAG Typhoon" ];
        
                var result = Math.floor(Math.random() * 100) + 1; //get a number from 1 to 100
                var index = 0; //index for gatchaPool
                var reward = 0;
        
                //check result
                if(result <= 50)
                {
                    index = 0;
                    reward = 10;
                }
                else if(result <= 70)
                {
                    index = 1;
                    reward = 50;
                }
                else if(result <= 90)
                {
                    index = 2;
                    reward = 110;
                }
                else if(result <= 99)
                {
                    index = 3;
                    reward = 1000;
                }
                else
                {
                    index = 4;
                    reward = 5000;
                }
        
                var pick = gatchaPool[index]; //get the item in the gatcha pool
        
                var total = reward - gatchaPrice; 
                data.money += total;
                data.save().catch(err => console.log(err));

                let roleMember = message.guild.member(message.author);
        
        
                embed.setTitle('you paid ' + gatchaPrice + currency + ' and got ' + pick + '!');
                embed.setDescription('you sold ' + pick + ' for ' + reward + currency);
                embed.addField('your balance: ' + data.money + currency);
                embed.setFooter('');
                
                message.channel.send(embed);
        
                //if user has role tier 8, the balance >= tier 9 cost, get one of the last two item in gatcha pool
                if(roleMember.roles.cache.has(role.tier8.id) && data.money >= role.tier9.cost && result > 90)
                {
                  data.money -= role.tier9.cost;//user pay the money
        
        
                  //promote
                  roleMember.roles.remove(role.tier8.id);
                  roleMember.roles.add(role.tier9.id);
                  
                  message.channel.send('Something special has happened, I wonder what it is :/');
                  data.save().catch(err => console.log(err));
        
                }
                
            }
        })






                

                  


            


        
	},
};