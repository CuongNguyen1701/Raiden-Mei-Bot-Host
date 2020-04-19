const Discord = require('discord.js');
const fs = require ('fs'); 
const money = require('../money.json');
const ms = require('parse-ms');
const cooldowns = require('../cooldowns.json');
const {currency, prefix} = require('../config.json');
const role = require('../roles.json');
const investment = require('../investments.json');
const color = require('../color.json');



module.exports = {
	name: 'stonks',
	description: 'stonks',
	execute(client, message, args) {
        let timeout = 1800000;  
        let interest = 0;
        let embed = new Discord.MessageEmbed();
        let user = message.author;
        let roleMember = message.guild.member(message.author);

        function WriteInvest()
        {
            fs.writeFile('./investments.json', JSON.stringify(investment),(err) => {
                if(err) console.log('error', err);
            });
        }
        function WriteMoney()
        {
            fs.writeFile('./money.json', JSON.stringify(money),(err) => {
                if(err) console.log('error', err);
              });
        }
        function Write()
        {
            WriteInvest();
            WriteMoney();
        }

        if(!money[user.id]) return message.reply('you have no balance!');
        if(!investment[user.id]) return message.reply("you haven't invested anything!");
        if(investment[user.id].stonks) return message.reply('you have already collected your money!');
        if(timeout - (Date.now() - investment[user.id].timeInvest) <= 0 )
        {
            investment[user.id].cooldowns = false;

        }
        if(investment[user.id].cooldowns)
        {
            time = ms(timeout -(Date.now() - investment[user.id].timeInvest));
    
            embed.setColor(color.blue);
            embed.setTitle(user.username + ", it's not the time yet!");
            embed.setDescription('able to stonks in ' + time.minutes + 'm' + time.seconds + 's');
            embed.setFooter(' ');
    
            message.channel.send(embed);
            
        }
        else
        {
            var investedMoney = investment[user.id].money;

            let base = 1;
            function hasTier(tier) {return roleMember.roles.cache.has(tier.id)}
            
            switch(hasTier(role.tier1) ? 1 : hasTier(role.tier2) ? 2 :
            hasTier(role.tier3) ? 3 : hasTier(role.tier4) ? 4 :
            hasTier(role.tier5) ? 5 : hasTier(role.tier6) ? 6 :
            hasTier(role.tier7) ? 7 : hasTier(role.tier8) ? 8 :
            hasTier(role.tier9) ? 9 : hasTier(role.tier10) ? 10 : 0)
            {
                case 1: base = 1; break;
                case 2: base = 1; break;
                case 3: base = 1.01; break;
                case 4: base = 1.015; break;
                case 5: base = 1.02; break;
                case 6: base = 1.025; break;
                case 7: base = 1.03; break;
                case 8: base = 1.035; break;
                case 9: base = 1.04; break;
                case 10: base = 1.05; break;
                case 0: base = 1; break;
            }


            switch((investedMoney < 0) ? 0 : 
                    (investedMoney > 0 && investedMoney <= 500) ? 1 :
                    (investedMoney > 500 && investedMoney <= 1000) ? 2 :
                    (investedMoney > 1000 && investedMoney <= 5000) ? 3 :
                    (investedMoney > 5000 && investedMoney <= 10000) ? 4 :
                    (investedMoney > 10000 && investedMoney <= 20000) ? 5 :
                    (investedMoney > 20000 && investedMoney <= 50000) ? 6 :
                    (investedMoney > 50000 && investedMoney <= 100000) ? 7 :
                    (investedMoney > 100000 && investedMoney <= 500000) ? 8 : 9)                 
            {
                case 0:
                    interest = 0.25;
                    break;                
                case 1:
                    interest = 1;
                    break;                
                case 2:
                    interest = 0.5;
                    break;                
                case 3:
                    interest = 0.4;
                    break;                
                case 4:
                    interest = 0.3;
                    break;                
                case 5:
                    interest = 0.2;
                    break;                
                case 6:
                    interest = 0.1;
                    break;                
                case 7:
                    interest = 0.09;
                    break;     
                case 8:
                    interest = 0.07;
                    break;
                case 9:
                    interest = 0.0005;
                    break;
            }


            let extra = Math.ceil(investedMoney * (1 + interest) * base);
            money[user.id].money += extra;
            investment[user.id].stonks = true;
            Write();

            embed.setColor(color.orange);
            if(investedMoney < 0) embed.setTitle('STINKS!');
            else embed.setTitle('STONKS!');
            
            embed.setDescription( user.username + ' received ' + extra + currency + ' (' + (extra - investedMoney) + currency +' interest)'+'! New balance: ' + money[user.id].money + currency);
            embed.setFooter(' ');
    
            message.channel.send(embed);

        }




    },
};