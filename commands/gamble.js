const Discord = require('discord.js');
const fs = require('fs');
const money = require('../money.json');
const {currency} = require('../config.json');
const role = require('../roles.json');



module.exports = {
	name: 'gamble',
	description: 'hên xui tỉ lệ 25%',
	execute(client, message, args) {
        var base = 1;

        let roleMember = message.guild.member(message.author);
        function hasTier(tier) {return roleMember.roles.cache.has(tier.id)}
   
    switch(hasTier(role.tier1) ? 1 : hasTier(role.tier2) ? 2 :
            hasTier(role.tier3) ? 3 : hasTier(role.tier4) ? 4 :
            hasTier(role.tier5) ? 5 : hasTier(role.tier6) ? 6 :
            hasTier(role.tier7) ? 7 : hasTier(role.tier8) ? 8 :
            hasTier(role.tier9) ? 9 : hasTier(role.tier10) ? 10 : 0)
            {
                case 1: base = 1.5; break;
                case 2: base = 2; break;
                case 3: base = 2.5; break;
                case 4: base = 3; break;
                case 5: base = 4; break;
                case 6: base = 5; break;
                case 7: base = 10; break;
                case 8: base = 20; break;
                case 9: base = 50; break;
                case 10: base = 70; break;
                case 0: base = 1; break;
            }
        


        var maxBet = 1000*base;


        if(!args[0] || isNaN(args[0])) return message.reply('please specify the number of money you want to bet');
        if(!money[message.author.id] || money[message.author.id].money <= 0) message.reply('you have no money!');

        else
        {
            try
            {
                var bet = parseInt(args[0])
            }
            catch
            {
                return message.reply('you can only enter intergers');
            }

            if(money[message.author.id].money < bet) message.reply('you do not have enough money');

            else if(bet > maxBet )  message.reply('you cannot bet more than ' + maxBet + currency + '!');

            else
            {
                let chances = ['win', 'lose', 'lose', 'lose'];
                var pick = chances[Math.floor(Math.random() * chances.length)];
    
                if(pick == 'lose')
                {
                    money[message.author.id].money -= Math.floor(bet * (base + 1)/ (base + 3));
                    fs.writeFile('./money.json', JSON.stringify(money), (err) => {
                        if(err) console.log('error', err);
                      });
                    message.reply('you lose... New balance: ' + money[message.author.id].money + currency );
                }
                else
                {
                    money[message.author.id].money += Math.floor( (4 * bet * (base + 1))/  (5 * (base + 3)));
                    fs.writeFile('./money.json', JSON.stringify(money), (err) => {
                        if(err) console.log('error', err);
                      });
                    message.reply('you win!! New balance: ' + money[message.author.id].money + currency );
                }

            }


        }
	},
};