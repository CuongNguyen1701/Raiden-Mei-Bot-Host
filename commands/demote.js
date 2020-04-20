const fs = require('fs');
const money = require('../money.json');
const { currency, mongoPass, prefix } = require('../config.json');
const Discord = require('discord.js');
const role = require('../roles.json');
const faction = require('../faction.json');
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
    name: 'demote',
    description: 'hạ chức lấy hỗ trợ',
    execute(client, message, args) {
        let roleMember = message.guild.member(message.author);
        let embed = new Discord.MessageEmbed;
        function hasTier(tier) { return roleMember.roles.cache.has(tier.id) } //check if the author has the specific role
        
        function Demote(currentTier, demoteTier) {
            var support = 0.5 * currentTier.cost; //support money

            Data.findOne({
                userID: message.author.id
            }, (err, data) => {
                if(err) console.log(err);
                if(!data){ //check if user has no data on database
                return message.reply('please use ' + prefix + 'create first');
                }
                else
                {
                    data.money += support;
        
                    data.save().catch(err => console.log(err));
        
                    roleMember.roles.remove(currentTier.id);
        
                    if (demoteTier != null) roleMember.roles.add(demoteTier.id); //used for cases that author has no economic role
        
                    embed.setTitle(message.author.username + ' has been demoted from ' + currentTier.name + ' to ' + demoteTier.name + '!');
                    embed.setDescription('you received a support of ' + support + currency + '! Current balance: ' + data.money);
                    embed.setColor(color.purple)
                    return message.channel.send(embed);
                    
                }
            })
            


        }


        switch (hasTier(role.tier1) ? 1 : hasTier(role.tier2) ? 2 :
            hasTier(role.tier3) ? 3 : hasTier(role.tier4) ? 4 :
                hasTier(role.tier5) ? 5 : hasTier(role.tier6) ? 6 :
                    hasTier(role.tier7) ? 7 : hasTier(role.tier8) ? 8 :
                        hasTier(role.tier9) ? 9 : hasTier(role.tier10) ? 10 : 0) {
            case 1: Demote(role.tier1, null); break;

            case 2: Demote(role.tier2, role.tier1); break;

            case 3: Demote(role.tier3, role.tier2); break;

            case 4: Demote(role.tier4, role.tier3); break;

            case 5: Demote(role.tier5, role.tier4); break;

            case 6: Demote(role.tier6, role.tier5); break;

            case 7: Demote(role.tier7, role.tier6); break;

            case 8: Demote(role.tier8, role.tier7); break;

            case 9: Demote(role.tier9, role.tier8); break;

            case 10: Demote(role.tier10, role.tier9); break;

            case 0: message.reply('you cannot demote anymore!'); break;
        }



    },
};