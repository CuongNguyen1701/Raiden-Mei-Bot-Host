
const Discord = require('discord.js');
const ms = require('parse-ms');
const { currency, prefix, mongoPass } = require('../config.json');
const role = require('../roles.json');
const color = require('../color.json');
const mongoose = require('mongoose');

//CONNECT TO DATABASE
mongoose.connect(process.env.mongoPass, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(err => console.log(err));

//MODELS
const Data = require('../models/data.js');



module.exports = {
    name: 'stonks',
    description: 'stonks',
    aliases: ['stk'],

    execute(client, message, args) {
        let timeout = 1800000;
        let interest = 0;
        let embed = new Discord.MessageEmbed();
        let roleMember = message.guild.member(message.author);
        function hasTier(tier) { return roleMember.roles.cache.has(tier.id) }
        function SaveData(data) { data.save().catch(err => console.log(err)); }

        Data.findOne({
            userID: message.author.id
        }, (err, data) => {
            if (err) console.log(err);
            if (!data) { //check if user has no data on database
                return message.reply('please use ' + prefix + 'create first');
            }
            else {
                if (!data.investMoney) return message.reply("you haven't invested anything!");
                if (data.investStonks) return message.reply('you have already collected your money!');

                if (timeout - (Date.now() - data.investTime) <= 0) {
                    data.investCD = false;//no cooldowns, use for triggering if statement
                    SaveData(data);
                }
                if (data.investCD)//still has cooldowns
                {
                    time = ms(timeout - (Date.now() - data.investTime));

                    embed.setColor(color.blue);
                    embed.setTitle(message.author.username + ", it's not the time yet!");
                    embed.setDescription('able to stonks in ' + time.minutes + 'm' + time.seconds + 's');
                    embed.setFooter(' ');

                    message.channel.send(embed);

                }
                else//no cooldowns
                {
                    var investedMoney = data.investMoney;//invested money using invest command

                    let base = 1;

                    switch (hasTier(role.tier1) ? 1 : hasTier(role.tier2) ? 2 :
                        hasTier(role.tier3) ? 3 : hasTier(role.tier4) ? 4 :
                            hasTier(role.tier5) ? 5 : hasTier(role.tier6) ? 6 :
                                hasTier(role.tier7) ? 7 : hasTier(role.tier8) ? 8 :
                                    hasTier(role.tier9) ? 9 : hasTier(role.tier10) ? 10 : 0) {
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


                    switch ((investedMoney < 0) ? 0 :
                        (investedMoney > 0 && investedMoney <= 500) ? 1 :
                            (investedMoney > 500 && investedMoney <= 1000) ? 2 :
                                (investedMoney > 1000 && investedMoney <= 5000) ? 3 :
                                    (investedMoney > 5000 && investedMoney <= 10000) ? 4 :
                                        (investedMoney > 10000 && investedMoney <= 20000) ? 5 :
                                            (investedMoney > 20000 && investedMoney <= 50000) ? 6 :
                                                (investedMoney > 50000 && investedMoney <= 100000) ? 7 :
                                                    (investedMoney > 100000 && investedMoney <= 500000) ? 8 : 9) {
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
                    }//interest decrease as more money invested


                    let extra = Math.ceil(investedMoney * (1 + interest) * base);
                    data.money += extra;
                    data.investStonks = true;
                    SaveData(data);

                    embed.setColor(color.orange);
                    if (investedMoney < 0) embed.setTitle('STINKS!');//if the author borrow money
                    else embed.setTitle('STONKS!');

                    embed.setDescription(message.author.username + ' received ' + extra + currency + ' (' + (extra - investedMoney) + currency + ' interest)' + '! New balance: ' + data.money + currency);
                    embed.setFooter(' ');

                    message.channel.send(embed);

                }

            }
        })






    },
};