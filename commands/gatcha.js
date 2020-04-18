const Discord = require('discord.js');
const fs = require('fs');
const money = require('../money.json');
const {currency} = require('../config.json');
const role = require('../roles.json');



module.exports = {
	name: 'gatcha',
	description: 'tiêu 100' + currency + ' đổi thưởng',
	execute(client, message, args) {


        if(!money[message.author.id] || money[message.author.id].money <= 0) message.reply('you have no money!');
        else
        {
            let embed = new Discord.MessageEmbed;
            
            var gatchaPrice = 100;
            if(money[message.author.id].money < gatchaPrice) message.reply('you do not have enough money, you need at least ' + gatchaPrice + currency);

            else
            {

                let gatchaPool = ["Mei's birthday cake", "Mei's underwears", "Mei's emblem", "Mei's bentou", "Mei's MAG Typhoon" ];

                var result = Math.floor(Math.random() * 100) +1;
                var index = 0;
                var reward = 0;

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

                var pick = gatchaPool[index];

                var total = reward - gatchaPrice;
                money[message.author.id].money += total;
                
                fs.writeFile('./money.json', JSON.stringify(money), (err) => {
                    if(err) console.log('error', err);
                });
                  let roleMember = message.guild.member(message.author);


                  embed.setTitle('you paid ' + gatchaPrice + currency + ' and got ' + pick + '!');
                  embed.setDescription('you sold ' + pick + ' for ' + reward + currency);
                  embed.addField('your balance: ' + money[message.author.id].money + currency);
                  embed.setFooter('');
                  
                  message.channel.send(embed);
                  if(roleMember.roles.cache.has(role.tier8.id) && money[message.author.id].money >= role.tier9.cost && index >= (gatchaPool.length - 1))
                  {
                    money[message.author.id].money -= role.tier9.cost;

                    fs.writeFile('./money.json', JSON.stringify(money), (err) => {
                        if(err) console.log('error', err);
                    });
                    roleMember.roles.remove(role.tier8.id);
                    roleMember.roles.add(role.tier9.id);
                    message.channel.send('Something special has happened, I wonder what it is :/');

                  }
                  


            }


        }
	},
};