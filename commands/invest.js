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
	name: 'invest',
	description: 'đầu tư, thay số bằng max hoặc all để đầu tư tối đa' ,
	execute(client, message, args) {
        let timeout = 1800000;  //time until author can receive the money
        let roleMember = message.guild.member(message.author);
        let embed = new Discord.MessageEmbed();
        let user = message.author;

        
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


        let maxBorrow = 1000;
        
        let base = 70;//percentage of the author balance
        /*
        function hasTier(tier) {return roleMember.roles.cache.has(tier.id)}
    
        switch(hasTier(role.tier1) ? 1 : hasTier(role.tier2) ? 2 :
        hasTier(role.tier3) ? 3 : hasTier(role.tier4) ? 4 :
        hasTier(role.tier5) ? 5 : hasTier(role.tier6) ? 6 :
        hasTier(role.tier7) ? 7 : hasTier(role.tier8) ? 8 :
        hasTier(role.tier9) ? 9 : hasTier(role.tier10) ? 10 : 0)
        {
            case 1: base = 90; break;
            case 2: base = 90; break;
            case 3: base = 80; break;
            case 4: base = 80; break;
            case 5: base = 75; break;
            case 6: base = 75; break;
            case 7: base = 70; break;
            case 8: base = 70; break;
            case 9: base = 65; break;
            case 10: base = 65; break;
            case 0: base = 50; break;
        }
        */
        let maxInvest = Math.ceil((base/100)*money[user.id].money);


        if(!money[user.id]) return message.reply('you have no balance to invest!');//no account
        
        if(!args[0]) return message.reply('please specify the amount you want to invest or borrow.');//no number after invest

        if((args[0] == 'max' || args[0] == 'all') && maxInvest > 0) args[0] = maxInvest;
        
        if(isNaN(args[0])) return;
        
        if(parseInt(args[0]) > Math.abs(maxInvest)) return message.reply("you cannot invest more than " + base + "% of your balance. Max investment: " + maxInvest + currency);
        
        if(parseInt(args[0]) <  - maxBorrow ) return message.reply('you cannot borrow more than ' + maxBorrow + currency );

        if(parseInt(args[0]) == 0) return message.reply('you cannot invest nothing UwU');


        
        
        if(!investment[user.id])//no past investments
        {
            money[user.id].money -= parseInt(args[0]);//take the money to invest
            
            investment[user.id] = {
                name: client.users.cache.get(user.id).tag,
                money: parseInt(args[0]),
                timeInvest: Date.now(),
                cooldowns: true,//having a cooldowns
                stonks: false//has not used stonks command yet
            }//create investment

            Write();
            embed.setColor(color.green);
            embed.setDescription(user.username + ' invested ' + args[0] + currency + '! Balance: ' +  money[user.id].money + currency );
            embed.setFooter(' ');
            message.channel.send(embed);
            
        }
        else//has done an investment
        {
            if(timeout -(Date.now() - investment[user.id].timeInvest) <= 0 )//cooldowns <= 0
            {
                investment[user.id].cooldowns = false;//bool used to trigger some statements
                WriteInvest();
            }
            if(investment[user.id].cooldowns)//still have cooldowns
            {
                
                time = ms(timeout -(Date.now() - investment[user.id].timeInvest));
        
                embed.setColor(color.red);
                embed.setTitle(user.username +', you are already investing!');
                embed.setDescription('able to stonks in ' + time.minutes + 'm' + time.seconds + 's');
                embed.setFooter(' ');
        
                message.channel.send(embed);
                
            }
            else if(!investment[user.id].stonks)//has not take the money last invested
            {
                message.reply('your last investment has been completed, please use ' + prefix + 'stonks to receive(or pay) your money first.');
            }
            else
            {
                money[user.id].money -= parseInt(args[0]);
                WriteMoney();
                investment[user.id].money = parseInt(args[0]);
                investment[user.id].timeInvest = Date.now();
                investment[user.id].cooldowns = true;//having cooldown
                investment[user.id].stonks = false;//has not used stonks yet
                WriteInvest();

                embed.setColor(color.green);
                embed.setTitle(user.username + ' invested ' + args[0] + currency + '! Balance: ' +  money[user.id].money + currency );
                embed.setFooter(' ');
                message.channel.send(embed);

            }
        }
        
        


    },
};