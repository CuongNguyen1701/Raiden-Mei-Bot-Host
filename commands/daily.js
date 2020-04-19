const Discord = require('discord.js');
const fs = require ('fs'); 
const money = require('../money.json');
const ms = require('parse-ms');
const cooldowns = require('../cooldowns.json');
const {currency, pCurrency} = require('../config.json');
const role = require('../roles.json');




module.exports = {
	name: 'daily',
	description: 'get daily rewards',
	execute(client, message, args) {

        //the cooldowns (in milisecond)
        let timeout = 86400000;  

        //multiplier based on role
        let base = 1;

        let roleMember = message.guild.member(message.author);
        let embed = new Discord.MessageEmbed();

        //check if the user has the role
        function hasTier(tier) {return roleMember.roles.cache.has(tier.id)}

        function writeDaily()
        {
            money[message.author.id].money += reward;
            if(!money[message.author.id].pMoney) money[message.author.id].pMoney = 0;
            money[message.author.id].pMoney += pReward;
            fs.writeFile('./money.json', JSON.stringify(money),(err) => {
                if(err) console.log('error', err);
              });
        }
        

        //send the embed message that provide the info about daily reward
        function sendDaily()
        {

            embed.setDescription('You collected your daily reward of ' + reward + currency + ' and ' + pReward + pCurrency + '!');
            embed.addField('Current balance is ' + money[message.author.id].money + currency + ', ' + money[message.author.id].pMoney + pCurrency)
            embed.setColor('00ff00');
            embed.setFooter(' ');
            message.channel.send(embed);
        }
   
        //check role => base
    switch(hasTier(role.tier1) ? 1 : hasTier(role.tier2) ? 2 :
            hasTier(role.tier3) ? 3 : hasTier(role.tier4) ? 4 :
            hasTier(role.tier5) ? 5 : hasTier(role.tier6) ? 6 :
            hasTier(role.tier7) ? 7 : hasTier(role.tier8) ? 8 :
            hasTier(role.tier9) ? 9 : hasTier(role.tier10) ? 10 : 0)
            {
                case 1: base = 1.5; break;
                case 2: base = 3; break;
                case 3: base = 7; break;
                case 4: base = 50; break;
                case 5: base = 70; break;
                case 6: base = 80; break;
                case 7: base = 100; break;
                case 8: base = 150; break;
                case 9: base = 300; break;
                case 10: base = 500; break;
                case 0: base = 1; break;
            }

        
        
        let reward = 100*base; //normal currency
        let pReward = 100; //premium currency

        embed.setTitle('Daily Reward!');

        if(!money[message.author.id])
        {
            //create a money account
            money[message.author.id] = {
                name: client.users.cache.get(message.author.id).tag,
                money: reward,
                pMoney: pReward
            };
            fs.writeFile('./money.json', JSON.stringify(money), (err) => {
                if(err) console.log('error', err);
              });

              //if there is no cooldowns
              if(!cooldowns[message.author.id]){
                cooldowns[message.author.id] = {
                    name: client.users.cache.get(message.author.id).tag,
                    daily: Date.now()
                };
                fs.writeFile('./cooldowns.json', JSON.stringify(cooldowns),(err) => {
                    if(err) console.log('error', err);
                  });


              }
              else 
              {
                  cooldowns[message.author.id].daily = Date.now();
                  fs.writeFile('./cooldowns.json', JSON.stringify(cooldowns),(err) => {
                      if(err) console.log('error', err);
                  });
              }

            sendDaily();
                
            
        } 
        else 
        {
            if(!cooldowns[message.author.id]){
                cooldowns[message.author.id] = {
                    name: client.users.cache.get(message.author.id).tag,
                    daily: Date.now()
                };

                fs.writeFile('./cooldowns.json', JSON.stringify(cooldowns),(err) => {
                    if(err) console.log('error', err);
                  });

                writeDaily();
                sendDaily();


            } 
            else //there is a cooldowns
            {
                if(timeout - (Date.now() - cooldowns[message.author.id].daily) > 0) //cooldowns has not reached 0
                {
                    time = ms(timeout - (Date.now() - cooldowns[message.author.id].daily))

                    embed.setColor('ff0000');
                    embed.setDescription('you already collected your daily reward');
                    embed.addField('collect again in ' + time.hours + 'h' + time.minutes + 'm' + time.seconds + 's');
                    embed.setFooter(' ');

                    message.channel.send(embed);
                }
                else //cooldowns has reached 0 or below
                {
                    cooldowns[message.author.id].daily = Date.now();
                  fs.writeFile('./cooldowns.json', JSON.stringify(cooldowns),(err) => {
                      if(err) console.log('error', err);
                  });
                    writeDaily();
                    sendDaily();
                }
            }
        }
	},
};