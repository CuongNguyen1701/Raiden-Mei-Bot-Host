const fs = require('fs');
const money = require('../money.json');
const faction = require('../faction.json');
const {currency} = require('../config.json');
const role = require('../roles.json');

module.exports = {
	name: 'leavefact',
	description: 'rời nhóm',
	execute(client, message, args) {
        let roleMember = message.guild.member(message.author);
        let user = message.author;
        if(!faction[user.id]) 
        {
            faction[user.id] = {
                name: client.users.cache.get(user.id).tag
            }
            fs.writeFile('./faction.json', JSON.stringify(faction), (err) => {
                if(err) console.log('error', err);
            });
            return message.reply("you haven't joined a faction!");
        }
        if(!faction[user.id].faction) return message.reply("you haven't joined a faction!");
        
        if(!money[user.id]) return message.reply('you have no balance')
        
        let cost = role.tier2.cost;

        if(roleMember.roles.cache.has(role.tier10.id)) cost = role.tier10.cost;
        else if(roleMember.roles.cache.has(role.tier9.id))cost = role.tier9.cost;
        else if(roleMember.roles.cache.has(role.tier8.id)) cost = role.tier8.cost;
        else if(roleMember.roles.cache.has(role.tier7.id)) cost = role.tier7.cost;
        else if(roleMember.roles.cache.has(role.tier6.id)) cost = role.tier6.cost;
        else if(roleMember.roles.cache.has(role.tier5.id)) cost = role.tier5.cost;
        else if(roleMember.roles.cache.has(role.tier4.id)) cost = role.tier4.cost;
        else if(roleMember.roles.cache.has(role.tier3.id)) cost = role.tier3.cost;
        else if(roleMember.roles.cache.has(role.tier2.id)) cost = role.tier2.cost;
        else if(roleMember.roles.cache.has(role.tier1.id)) cost = role.tier2.cost;
        else cost = role.tier2.cost;


        money[user.id].money -= cost;

        message.reply('you left ' + faction[user.id].faction + ' faction' )
        
        faction[user.id].faction = null;

        fs.writeFile('./money.json', JSON.stringify(money), (err) => {
            if(err) console.log('error', err);
        });

        fs.writeFile('./faction.json', JSON.stringify(faction), (err) => {
            if(err) console.log('error', err);
        });
    },
};