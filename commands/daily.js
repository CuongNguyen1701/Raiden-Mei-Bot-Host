const Discord = require('discord.js');
const ms = require('parse-ms');
const role = require('../roles.json');

const { mongoPass, currency, pCurrency } = require('../config.json');
const mongoose = require('mongoose');


//CONNECT TO DATABASE
mongoose.connect( process.env.mongoPass, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log( 'Database Connected' ))
.catch(err => console.log( err ));
//MODELS
const Data = require('../models/data.js');

module.exports = {
    name: 'daily',
    description: 'nhận thưởng hàng ngày, ice faction nhận gấp 5 lần',
    execute(client, message, args) {

        //the cooldowns (in milisecond)
        let timeout = 86400000;

        //multiplier based on role
        let base = 1;

        let roleMember = message.guild.member(message.author);
        let embed = new Discord.MessageEmbed();
        embed.setTitle('Daily Reward!');

        //check if the user has the role
        function hasTier(tier) { return roleMember.roles.cache.has(tier.id) }

        //check role => base
        switch (hasTier(role.tier1) ? 1 : hasTier(role.tier2) ? 2 :
            hasTier(role.tier3) ? 3 : hasTier(role.tier4) ? 4 :
                hasTier(role.tier5) ? 5 : hasTier(role.tier6) ? 6 :
                    hasTier(role.tier7) ? 7 : hasTier(role.tier8) ? 8 :
                        hasTier(role.tier9) ? 9 : hasTier(role.tier10) ? 10 : 0) {
            case 1: base = 1.5; break;
            case 2: base = 5; break;
            case 3: base = 10; break;
            case 4: base = 50; break;
            case 5: base = 70; break;
            case 6: base = 80; break;
            case 7: base = 100; break;
            case 8: base = 150; break;
            case 9: base = 300; break;
            case 10: base = 500; break;
            case 0: base = 1; break;
        }


        let reward = 100 * base; //normal currency
        let pReward = 100; //premium currency

        //send the embed message that provide the info about daily reward
        function sendDaily(data) {

            embed.setDescription('You collected your daily reward of ' + reward + currency + ' and ' + pReward + pCurrency + '!');
            embed.addField('Current balance is ' + data.money + currency + ', ' + data.pMoney + pCurrency)
            embed.setColor('00ff00');
            embed.setFooter(' ');
            message.channel.send(embed);
        }

        Data.findOne({
            userID: message.author.id
        }, (err, data) => {
            if (err) console.log(err);
            if (!data) { //check if user has no data on database
                const newData = new Data({
                    name: message.author.username,
                    userID: message.author.id,
                    lb: 'all',
                    money: reward,
                    pMoney: pReward,
                    faction: null,
                    daily: Date.now(),
                    investMoney: null,
                    investTime: null,
                    investCD: false,
                    investStonks: true,

                })
                newData.save().catch(err => console.log(err));
                return sendDaily(newData);

            } else {
                if (timeout - (Date.now() - data.daily) > 0)// if still cd
                {
                    let time = ms(timeout - (Date.now() - data.daily))

                    embed.setColor('ff0000');
                    embed.setDescription('you already collected your daily reward');
                    embed.addField('collect again in: ', time.hours + 'h' + time.minutes + 'm' + time.seconds + 's');
               

                    return message.channel.send(embed);
                }
                else {
                    if(data.faction == 'ice')
                    {
                        reward *= 5;
                        embed.setTitle('Ice faction boosted Daily Reward!')
                    }

                    data.daily = Date.now();//set new CD
                    data.money += reward;
                    data.pMoney += pReward;
                    data.save().catch(err => console.log(err));


                    return sendDaily(data);
                }
            }
        })

    },
};

/*
            data.findOne({
                userID: message.author.id
            }, (err, data) => {
                if(err) console.log(err);
                if(!data){ //check if user has no data on database
                return message.reply('please use ' + prefix + 'create first');
                }
                else
                {
                    data.save().catch(err => console.log(err));
                    
                }
            })
*/