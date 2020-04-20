const Discord = require('discord.js');
const ms = require('parse-ms');

const {currency, prefix, mongoPass} = require('../config.json');
const role = require('../roles.json');
const color = require('../color.json');

const mongoose = require('mongoose');


//CONNECT TO DATABASE
mongoose.connect(mongoPass, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

//MODELS
const Data = require('../models/data.js');

module.exports = {
	name: 'invest',
	description: 'đầu tư, thay số bằng max hoặc all để đầu tư tối đa' ,
	execute(client, message, args) {
        let timeout = 1800000;  //time until author can receive the money
        let roleMember = message.guild.member(message.author);
        let embed = new Discord.MessageEmbed();
        let user = message.author;


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
       Data.findOne({
        userID: message.author.id
    }, (err, data) => {
        if(err) console.log(err);
        if(!data){ //check if user has no data on database
        return message.reply('please use ' + prefix + 'create first');
        }
        else
        {
            let maxInvest = Math.ceil((base/100)*data.money);
            if(!args[0]) return message.reply('please specify the amount you want to invest or borrow.');//no number after invest
            if((args[0] == 'max' || args[0] == 'all') && maxInvest > 0) args[0] = maxInvest;
            if(isNaN(args[0])) return;
            if(parseInt(args[0]) > Math.abs(maxInvest)) return message.reply("you cannot invest more than " + base + "% of your balance. Max investment: " + maxInvest + currency);
            if(parseInt(args[0]) <  - maxBorrow ) return message.reply('you cannot borrow more than ' + maxBorrow + currency );
            if(parseInt(args[0]) == 0) return message.reply('you cannot invest nothing UwU');
            if(!data.investMoney)//no past investments
            {
                data.money -= parseInt(args[0]);//take the money to invest
                
                data.investMoney = parseInt(args[0]);
                data.investTime = Date.now();
                data.investCD = true;//having a cooldowns
                data.investStonks = false;//has not used stonks command yet

                data.save().catch(err => console.log(err));
                
                
                embed.setColor(color.green);
                embed.setDescription(user.username + ' invested ' + args[0] + currency + '! Balance: ' +  data.money + currency );
                embed.setFooter(' ');
                message.channel.send(embed);
                
            }
            else//has done an investment
            {
                if(timeout -(Date.now() - data.investTime) <= 0 )//cooldowns <= 0
                {
                    data.investCD = false;//bool used to trigger some statements
                    data.save().catch(err => console.log(err));
                    
                }
                if(data.investCD)//still have cooldowns
                {
                    
                    time = ms(timeout -(Date.now() - data.investTime));
            
                    embed.setColor(color.red);
                    embed.setTitle(user.username +', you are already investing!');
                    embed.setDescription('able to stonks in ' + time.minutes + 'm' + time.seconds + 's');
                    embed.setFooter(' ');
            
                    message.channel.send(embed);
                    
                }
                else if(!data.investStonks)//has not take the money last invested
                {
                    message.reply('your last investment has been completed, please use ' + prefix + 'stonks to receive(or pay) your money first.');
                }
                else
                {
                    data.money -= parseInt(args[0]);
                    
                    data.investMoney = parseInt(args[0]);
                    data.investTime = Date.now();
                    data.investCD = true;//having cooldown
                    data.investStonks = false;//has not used stonks yet
                    data.save().catch(err => console.log(err));

        
                    embed.setColor(color.green);
                    embed.setTitle(user.username + ' invested ' + args[0] + currency + '! Balance: ' +  data.money + currency );
                    embed.setFooter(' ');
                    message.channel.send(embed);
        
                }
            }
            

            
        }
    })



        

        
        
        



        
        
        
        


    },
};