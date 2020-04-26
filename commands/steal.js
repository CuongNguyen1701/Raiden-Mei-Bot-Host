
const { currency, mongoPass } = require('../config.json');
const Discord = require('discord.js');
const role = require('../roles.json');
const mongoose = require('mongoose');
const color = require('../color.json');

//CONNECT TO DATABASE
mongoose.connect(process.env.mongoPass, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database Connected'))
    .catch(err => console.log(err));

//MODELS
const Data = require('../models/data.js');
const RpgData = require('../models/rpgdata.js');




module.exports = {
    name: 'steal',
    description: 'cướp tiền, tỉ lệ 67%, physical faction có khả năng crit, cướp gấp đôi số tiền(tiền phạt giảm 33%)',
    cooldown: 5,
    execute(client, message, args) {


        let user = message.mentions.members.first() || client.users.cache.get(args[0]);
        var base = 1;
        let roleMember = message.guild.member(message.author);
        function hasTier(tier) { return roleMember.roles.cache.has(tier.id) }
        function SaveData(data) { data.save().catch(err => console.log(err)); }

        //check role
        switch (hasTier(role.tier1) ? 1 : hasTier(role.tier2) ? 2 :
            hasTier(role.tier3) ? 3 : hasTier(role.tier4) ? 4 :
                hasTier(role.tier5) ? 5 : hasTier(role.tier6) ? 6 :
                    hasTier(role.tier7) ? 7 : hasTier(role.tier8) ? 8 :
                        hasTier(role.tier9) ? 9 : hasTier(role.tier10) ? 10 : 0) {
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


        let embed = new Discord.MessageEmbed;
        let steal = 500 * base;
        if (!user) return message.reply('sorry, could not find that user...');


        Data.findOne({//find author data
            userID: message.author.id
        }, (err, authorData) => {
            if (err) console.log(err);
            if (!authorData) { //check if user has no data on database
                return message.reply('please use ' + prefix + 'create first');
            }
            else {
                Data.findOne({//findf user data
                    userID: user.id
                }, (err, userData) => {
                    if (err) console.log(err);
                    if (!userData) return message.reply('user has no money!')
                    else {
                        RpgData.findOne({//find author rpg data
                            userID: message.author.id
                        }, (err, author_rpgData) => {
                            if (err) console.log(err);
                            if (!author_rpgData) {
                                return message.reply('please declare your position using ' + prefix + 'position first!')
                            }
                            RpgData.findOne({//find user rpg data
                                userID: user.id
                            }, (err, user_rpgData) => {
                                if (err) console.log(err);
                                if (!user_rpgData) {
                                    return message.reply('user has not enter the map yet!');
                                }
                                let range = 1;
                                //both directions' distance is larger than 1
                                if ((Math.abs(author_rpgData.posY - user_rpgData.posY) > range) || (Math.abs(author_rpgData.posX - user_rpgData.posX) > range)) {
                                    return message.reply('user is too far away!');
                                }
                                //else the player is nearby

                                try {// same faction -> cannot steal
                                    if (userData.faction == null) { }
                                    else if (userData.faction == authorData.faction) return message.reply('you cannot steal a person in your faction!');
                                    else { };
                                }
                                catch
                                { }
                                //if author doesnt provide any number of currency to steal
                                if (!args[1] || !parseInt(args[1])) {
                                    if (userData.money > steal) args[1] = Math.floor(Math.random() * steal + 1);
        
                                    else args[1] = Math.floor(Math.random() * userData.money) + 1;
                                }
                                if (parseInt(args[1]) < 1) return message.reply("you cannot steal less than 1" + currency + ", that's meaningless!");
        
                                //if tagged person is Mei
                                if (userData.name == "Raiden Mei 2.0#4150") {
                                    authorData.money -= 10 * steal;
                                    SaveData(authorData);
                                    return message.reply("You cannot steal from Mei! Here's a fine of " + 10 * steal + currency + "!");
                                }
        
                                //if provided number(arg[1]) larger than max steal
                                if (parseInt(args[1]) > steal) return message.reply("stop being greedy! you can only steal up to " + steal + currency + "!");
                                //if steal number is more than the user's balance
                                if (parseInt(args[1]) > userData.money) return message.reply('they do not have that much money!');
        
                                //obvious
        
        
                                //check if the author has negative balance 
                                if (authorData.money < 0) return message.reply('you are too poor to steal!');
                                let chances = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                                var pick = chances[Math.floor(Math.random() * chances.length)];
        
                                let stealNumber = parseInt(args[1]);
        
                                if (authorData.faction == 'physical') {
                                    let critPool = [true, false]
                                    var crit = critPool[Math.floor(Math.random() * critPool.length)];
                                    if (crit) stealNumber *= 2;
                                    else stealNumber *= 1;
                                }
        
                                if (pick >= 4) {
        
        
                                    userData.money -= stealNumber;
        
                                    authorData.money += stealNumber;
        
                                    SaveData(userData);
                                    SaveData(authorData);
        
                                    embed.setColor(color.green);
                                    if (crit) {
                                        embed.setTitle(message.author.username + ' got a physical faction boost and successfully CRIT stealed ' + stealNumber + currency + ' from '
                                            + client.users.cache.get(user.id).username + '. ' + message.author.username + "'s new balance: " + authorData.money + currency);
                                    }
                                    else {
                                        embed.setTitle(message.author.username + ' successfully stealed ' + stealNumber + currency + ' from '
                                            + client.users.cache.get(user.id).username + '. ' + message.author.username + "'s new balance: " + authorData.money + currency);
        
                                    }
                                    embed.setDescription(client.users.cache.get(user.id).username + ' lost their money. ' + client.users.cache.get(user.id).username
                                        + "'s new balance: " + userData.money + currency);
        
                                    embed.setFooter('');
                                    message.channel.send(embed);
        
                                }
                                else {
                                    let fine = 3 * parseInt(args[1])
        
                                    if (authorData.faction == 'physical') fine = 2 * parseInt(args[1]);
        
                                    authorData.money -= fine;
                                    userData.money += parseInt(fine / 2);
        
        
                                    SaveData(userData);
                                    SaveData(authorData);
        
                                    embed.setColor(color.red);
                                    if (authorData.faction == 'physical') {
                                        embed.setTitle(message.author.username + ' failed but only received a fine of ' + fine + currency + ' thanks to physical faction boost. '
                                            + message.author.username + "'s new balance: " + authorData.money + currency);
        
                                    }
                                    else {
        
                                        embed.setTitle(message.author.username + ' failed and received a fine of ' + fine + currency + '. '
                                            + message.author.username + "'s new balance: " + authorData.money + currency);
        
                                    }
        
                                    embed.setDescription(client.users.cache.get(user.id).username + ' was compensated ' + parseInt(fine / 2) + currency + '. '
                                        + client.users.cache.get(user.id).username + "'s new balance: " + userData.money + currency);
                                    embed.setFooter('');
                                    message.channel.send(embed);
        
                                }

                            })
                        })
                    }
                })

            }
        })






















    },
};