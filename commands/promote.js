const fs = require('fs');
const money = require('../money.json');
const {currency} = require('../config.json');
const Discord = require('discord.js');
const role = require('../roles.json');
const faction = require('../faction.json');




module.exports = {
	name: 'promote',
	description: 'thăng chức',
	execute(client, message, args) {
        let roleMember = message.guild.member(message.author);
        let embed = new Discord.MessageEmbed;

        function Promote(currentTier, promoteTier)
        {
            //check if the balance have enough money to promote
            if(money[message.author.id].money < promoteTier.cost) return message.reply('you do not have enough money, you need at least ' + promoteTier.cost + currency + ' to become a ' + promoteTier.name);

            money[message.author.id].money -= promoteTier.cost;
            fs.writeFile('./money.json', JSON.stringify(money), (err) => {
                if(err) console.log('error', err);
            });
            if (currentTier != null) roleMember.roles.remove(currentTier.id);//use for cases when user has no eco role
            
            roleMember.roles.add(promoteTier.id);

            message.channel.send(message.author.username + ' is a'+ promoteTier.name +'now! Current balance: ' + money[message.author.id].money);
        }
        if(!money[message.author.id].money) return message.reply('you must have a balance first!')

        if(roleMember.roles.cache.has(role.tier10.id)) return message.reply('you have already completed the game!');

        if(roleMember.roles.cache.has(role.tier9.id))
        {
            return Promote(role.tier9, role.tier10);

        }

        if(roleMember.roles.cache.has(role.tier8.id)) return message.reply('you are already at the top of the world!');
        
        if(roleMember.roles.cache.has(role.tier7.id))
        {
            return Promote(role.tier7, role.tier8);

        }

        if(roleMember.roles.cache.has(role.tier6.id)) return message.reply('you are already at the top of the food chain!');

        if(roleMember.roles.cache.has(role.tier5.id))
        {
            return Promote(role.tier5, role.tier6);

        }
        if(roleMember.roles.cache.has(role.tier4.id))
        {
            return Promote(role.tier4, role.tier5);
        }        

        if(roleMember.roles.cache.has(role.tier3.id)) return message.reply('wonder what could beyond this?')

        if(roleMember.roles.cache.has(role.tier2.id) && faction[message.author.id])
        {
            return Promote(role.tier2, role.tier3);

        }

        if(roleMember.roles.cache.has(role.tier2.id)) return message.reply('you have to join a faction in order to be promoted!')

        if(roleMember.roles.cache.has(role.tier1.id))
        {
            return Promote(role.tier1, role.tier2);
        }

        else Promote( null , role.tier1);//no role
        




    },
};